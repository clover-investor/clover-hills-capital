import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

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

export async function POST() {
    // 1. Admin Verification
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminDb = createAdminClient();

    // 2. Process ROI using RPC
    const { data: processedCount, error: rpcError } = await adminDb.rpc('process_daily_roi');
    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });

    // 3. Notifications (Same logic as Cron)
    let roiDetails: any[] = [];
    if (processedCount && typeof processedCount === 'number' && processedCount > 0) {
        try {
            const { data: recentEarnings } = await adminDb
                .from("transactions")
                .select("amount, created_at, users(email, available_balance)")
                .eq("type", "earning")
                .gte("created_at", new Date(Date.now() - 15000).toISOString());

            if (recentEarnings && recentEarnings.length > 0) {
                roiDetails = (recentEarnings as any[])
                    .map((tx) => {
                        const user = Array.isArray(tx.users) ? tx.users[0] : tx.users;
                        if (!user?.email) return null;
                        return {
                            email: user.email,
                            amount: Number(tx.amount).toFixed(2),
                            newBalance: Number(user.available_balance).toFixed(2),
                            timestamp: tx.created_at
                        };
                    })
                    .filter((u): u is any => u !== null);

                const { sendBulkDailyRoiEmail } = await import('@/lib/email');
                await sendBulkDailyRoiEmail(roiDetails);
            }
        } catch (emailErr) {
            console.error("ROI email dispatch failed:", emailErr);
        }
    }

    // 4. Top-up Reminders
    let topUpRemindersSent = 0;
    let reminderDetails: any[] = [];
    try {
        const { data: investments, error: investmentsError } = await adminDb
            .from("transactions")
            .select("id, amount, top_up_frequency, created_at, last_top_up_email_at, users(email, full_name)")
            .eq("type", "investment")
            .eq("status", "approved")
            .not("top_up_frequency", "is", null);

        if (!investmentsError && investments) {
            const todayUtc = startOfUtcDay(new Date());

            for (const tx of (investments as any[])) {
                const frequencyDays = frequencyToDays(tx.top_up_frequency);
                if (!frequencyDays) continue;

                const createdAt = new Date(tx.created_at);
                if (Number.isNaN(createdAt.getTime())) continue;

                const daysSinceStart = Math.floor((todayUtc - startOfUtcDay(createdAt)) / (1000 * 60 * 60 * 24));

                // Remind 1 day before the top-up date
                // Formula: (daysSinceStart + 1) % frequencyDays === 0
                const isApproaching = (daysSinceStart + 1) % frequencyDays === 0;

                if (!isApproaching) continue;

                const lastSent = tx.last_top_up_email_at ? new Date(tx.last_top_up_email_at) : null;
                const alreadySentToday = lastSent && startOfUtcDay(lastSent) === todayUtc;
                if (alreadySentToday) continue;

                const user = Array.isArray(tx.users) ? tx.users[0] : tx.users;
                if (!user?.email) continue;

                reminderDetails.push({
                    txId: tx.id,
                    email: user.email,
                    fullName: user.full_name || "Investor",
                    amount: Number(tx.amount).toFixed(2),
                    frequencyLabel: frequencyToLabel(frequencyDays),
                    timestamp: new Date().toISOString()
                });
            }

            if (reminderDetails.length > 0) {
                const { sendBulkTopUpReminderEmail } = await import('@/lib/email');
                await sendBulkTopUpReminderEmail(
                    reminderDetails.map((r) => ({
                        email: r.email,
                        fullName: r.fullName,
                        amount: r.amount,
                        frequencyLabel: r.frequencyLabel,
                    }))
                );

                const ids = reminderDetails.map((r) => r.txId);
                await adminDb
                    .from("transactions")
                    .update({ last_top_up_email_at: new Date().toISOString() })
                    .in("id", ids);

                topUpRemindersSent = reminderDetails.length;
            }
        }
    } catch (topUpErr) {
        console.error("Top-up reminder dispatch failed:", topUpErr);
    }

    return NextResponse.json({
        success: true,
        processedCount: processedCount || 0,
        topUpRemindersSent,
        roiDetails,
        reminderDetails
    });
}
