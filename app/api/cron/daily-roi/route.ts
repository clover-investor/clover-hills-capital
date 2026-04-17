import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const maxDuration = 60; // Allows up to 60s execution

function frequencyToDays(raw: string | null): number | null {
    if (!raw) return null;
    const match = raw.match(/\d+/);
    if (!match) return null;
    const days = Number(match[0]);
    return Number.isFinite(days) && days > 0 ? days : null;
}

function frequencyToLabel(days: number): string {
    if (days === 7) return "7 Days (Weekly)";
    if (days === 14) return "14 Days (Bi-Weekly)";
    if (days === 30) return "30 Days (Monthly)";
    return `${days} Days`;
}

function startOfUtcDay(d: Date): number {
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

type RecentEarning = {
    amount: number | string;
    users: {
        email: string;
        available_balance: number | string;
    } | null;
};

type InvestmentWithFrequency = {
    id: string;
    amount: number | string;
    top_up_frequency: string | null;
    created_at: string;
    last_top_up_email_at: string | null;
    users: {
        email: string;
        full_name: string | null;
    } | null;
};

export async function GET(req: Request) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const adminDb = createAdminClient();

    // 2. Call the Postgres RPC function to process ROI securely, atomically, and optimally
    // This fully prevents duplicates, floating point errors, and N+1 queries.
    const { data: processedCount, error } = await adminDb.rpc('process_daily_roi');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (processedCount && typeof processedCount === 'number' && processedCount > 0) {
        try {
            // Query earning transactions created in the last 15 seconds
            const { data: recentEarnings } = await adminDb
                .from("transactions")
                .select("amount, users(email, available_balance)")
                .eq("type", "earning")
                .gte("created_at", new Date(Date.now() - 15000).toISOString());

            if (recentEarnings && recentEarnings.length > 0) {
                const usersToNotify = (recentEarnings as any[])
                    .map((tx) => {
                        const user = Array.isArray(tx.users) ? tx.users[0] : tx.users;
                        if (!user?.email) return null;
                        return {
                            email: user.email,
                            amount: Number(tx.amount).toFixed(2),
                            newBalance: Number(user.available_balance).toFixed(2)
                        };
                    })
                    .filter((u): u is { email: string; amount: string; newBalance: string } => u !== null);

                const { sendBulkDailyRoiEmail } = await import('@/lib/email');
                await sendBulkDailyRoiEmail(usersToNotify);
            }
        } catch (emailErr) {
            console.error("Email dispatch failed:", emailErr);
        }
    }

    let topUpRemindersSent = 0;
    try {
        const { data: investments, error: investmentsError } = await adminDb
            .from("transactions")
            .select("id, amount, top_up_frequency, created_at, last_top_up_email_at, users(email, full_name)")
            .eq("type", "investment")
            .eq("status", "approved")
            .not("top_up_frequency", "is", null);

        if (investmentsError) {
            throw investmentsError;
        }

        const todayUtc = startOfUtcDay(new Date());
        const dueRecipients: { txId: string; email: string; fullName: string; amount: string; frequencyLabel: string }[] = [];

        for (const tx of (investments || []) as any[]) {
            const frequencyDays = frequencyToDays(tx.top_up_frequency);
            if (!frequencyDays) continue;

            const createdAt = new Date(tx.created_at);
            if (Number.isNaN(createdAt.getTime())) continue;

            const daysSinceStart = Math.floor((todayUtc - startOfUtcDay(createdAt)) / (1000 * 60 * 60 * 24));
            if (daysSinceStart < frequencyDays || daysSinceStart % frequencyDays !== 0) continue;

            const lastSent = tx.last_top_up_email_at ? new Date(tx.last_top_up_email_at) : null;
            const alreadySentToday = lastSent && startOfUtcDay(lastSent) === todayUtc;
            if (alreadySentToday) continue;

            const user = Array.isArray(tx.users) ? tx.users[0] : tx.users;
            if (!user?.email) continue;

            dueRecipients.push({
                txId: tx.id,
                email: user.email,
                fullName: user.full_name || "Investor",
                amount: Number(tx.amount).toFixed(2),
                frequencyLabel: frequencyToLabel(frequencyDays),
            });
        }

        if (dueRecipients.length > 0) {
            const { sendBulkTopUpReminderEmail } = await import('@/lib/email');
            await sendBulkTopUpReminderEmail(
                dueRecipients.map((r) => ({
                    email: r.email,
                    fullName: r.fullName,
                    amount: r.amount,
                    frequencyLabel: r.frequencyLabel,
                }))
            );

            const ids = dueRecipients.map((r) => r.txId);
            const { error: updateError } = await adminDb
                .from("transactions")
                .update({ last_top_up_email_at: new Date().toISOString() })
                .in("id", ids);

            if (updateError) {
                console.error("Failed to update last_top_up_email_at:", updateError);
            } else {
                topUpRemindersSent = dueRecipients.length;
            }
        }
    } catch (topUpErr) {
        console.error("Top-up reminder dispatch failed:", topUpErr);
    }

    return NextResponse.json({
        message: `Successfully processed ${processedCount} investments in database transaction.`,
        topUpRemindersSent,
        success: true
    }, { status: 200 });
}
