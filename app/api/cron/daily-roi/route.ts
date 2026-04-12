import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const maxDuration = 60; // Allows up to 60s execution

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
                const usersToNotify = recentEarnings.map((tx: any) => ({
                    email: tx.users.email,
                    amount: Number(tx.amount).toFixed(2),
                    newBalance: Number(tx.users.available_balance).toFixed(2)
                }));

                const { sendBulkDailyRoiEmail } = await import('@/lib/email');
                await sendBulkDailyRoiEmail(usersToNotify);
            }
        } catch (emailErr) {
            console.error("Email dispatch failed:", emailErr);
        }
    }

    return NextResponse.json({
        message: `Successfully processed ${processedCount} investments in database transaction.`,
        success: true
    }, { status: 200 });
}
