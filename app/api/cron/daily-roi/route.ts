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

    // Fetch all active investments
    const { data: investments, error: invError } = await adminDb
        .from("transactions")
        .select(`
            *,
            plans (*),
            users (*)
        `)
        .eq("type", "investment")
        .eq("status", "approved"); // active investments

    if (invError) {
        return NextResponse.json({ error: invError.message }, { status: 500 });
    }

    if (!investments || investments.length === 0) {
        return NextResponse.json({ message: "No active investments found." }, { status: 200 });
    }

    let processedCount = 0;
    const now = new Date();

    for (const inv of investments) {
        if (!inv.plans || !inv.users) continue;

        const plan = inv.plans;
        const user = inv.users;
        const createdAt = new Date(inv.created_at);

        // Calculate days elapsed (inclusive of start day)
        const diffTime = Math.abs(now.getTime() - createdAt.getTime());
        const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (daysElapsed >= plan.duration_days) {
            // INVESTMENT MATURED: Return Principal
            const amountInvested = parseFloat(inv.amount);
            const newAvailableBalance = parseFloat(user.available_balance) + amountInvested;
            const newInvested = parseFloat(user.invested) - amountInvested;

            // Mark investment as completed and update balance
            await adminDb.from("transactions").update({ status: "completed" }).eq("id", inv.id);
            await adminDb.from("users").update({
                available_balance: newAvailableBalance,
                invested: newInvested
            }).eq("id", user.id);

            // Log maturation event
            await adminDb.from("transactions").insert({
                user_id: user.id,
                type: "earning", // Or "system" / "maturation"
                amount: amountInvested,
                status: "approved",
                note: `Principal returned for ${plan.name}`
            });

            processedCount++;
            continue;
        }

        // DAILY EARNINGS (if not matured)
        const amountInvested = parseFloat(inv.amount);
        const dailyRoiPercent = parseFloat(plan.daily_roi);
        const dailyEarnings = (amountInvested * dailyRoiPercent) / 100;

        // Update user balances
        const newTotalBalance = parseFloat(user.total_balance) + dailyEarnings;
        const newAvailableBalance = parseFloat(user.available_balance) + dailyEarnings;
        const newEarnings = parseFloat(user.earnings) + dailyEarnings;

        const { error: updateError } = await adminDb
            .from("users")
            .update({
                total_balance: newTotalBalance,
                available_balance: newAvailableBalance,
                earnings: newEarnings
            })
            .eq("id", user.id);

        if (!updateError) {
            // Log earning transaction
            await adminDb.from("transactions").insert({
                user_id: user.id,
                type: "earning",
                amount: dailyEarnings,
                status: "approved",
                plan_id: plan.id
            });
            processedCount++;
        }
    }

    return NextResponse.json({ message: `Successfully processed ${processedCount} investments.` }, { status: 200 });
}
