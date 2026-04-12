import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { planId, amount } = await req.json();

        if (!planId || !amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid investment parameters" }, { status: 400 });
        }

        // 1. Get current balance (Use admin to ensure read success)
        const { data: user, error: userError } = await adminSupabase
            .from("users")
            .select("available_balance, invested, total_balance")
            .eq("id", authUser.id)
            .single();

        if (userError || !user) {
            throw new Error("Could not fetch user data");
        }

        if (user.available_balance < amount) {
            return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
        }

        // 2. Perform updates (Use admin to bypass RLS)
        const newAvailable = Number(user.available_balance) - Number(amount);
        const newInvested = Number(user.invested) + Number(amount);

        const { error: updateError } = await adminSupabase
            .from("users")
            .update({
                available_balance: newAvailable,
                invested: newInvested,
                updated_at: new Date().toISOString()
            })
            .eq("id", authUser.id);

        if (updateError) throw updateError;

        // 3. Log the transaction (Check if plan exists to avoid FK error)
        let linkablePlanId = null;
        let planName = "Algorithmic Strategy";

        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId)) {
            const { data: plan } = await adminSupabase
                .from("plans")
                .select("id, name")
                .eq("id", planId)
                .single();
            if (plan) {
                linkablePlanId = plan.id;
                planName = plan.name;
            }
        }

        const { error: txError } = await adminSupabase.from("transactions").insert({
            user_id: authUser.id,
            type: "investment",
            amount: amount,
            plan_id: linkablePlanId,
            status: "approved"
        });

        if (txError) {
            console.error("Failed to log transaction:", txError);
            return NextResponse.json({ error: "Balance updated but transaction log failed: " + txError.message }, { status: 500 });
        }

        try {
            const { sendNewInvestmentEmail } = await import('@/lib/email');
            await sendNewInvestmentEmail((authUser as any).email, Number(amount).toFixed(2), planName);
        } catch (emailErr) {
            console.error("Investment email dispatch failed:", emailErr);
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Investment Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
