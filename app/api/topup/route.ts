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
        const { transactionId, amount } = await req.json();

        if (!transactionId || !amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid top-up parameters" }, { status: 400 });
        }

        // 1. Get current investment and user balance
        const [investRes, userRes] = await Promise.all([
            adminSupabase.from("transactions").select("*").eq("id", transactionId).eq("user_id", authUser.id).single(),
            adminSupabase.from("users").select("available_balance, invested").eq("id", authUser.id).single()
        ]);

        if (investRes.error || !investRes.data) return NextResponse.json({ error: "Investment not found" }, { status: 404 });
        if (userRes.error || !userRes.data) return NextResponse.json({ error: "User data not found" }, { status: 404 });

        const investment = investRes.data;
        const user = userRes.data;

        if (user.available_balance < amount) {
            return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
        }

        // 2. Perform updates
        const newAvailable = Number(user.available_balance) - Number(amount);
        const newInvested = Number(user.invested) + Number(amount);
        const newInvestAmount = Number(investment.amount) + Number(amount);

        // Update user balances
        const { error: userUpdateError } = await adminSupabase
            .from("users")
            .update({
                available_balance: newAvailable,
                invested: newInvested,
                updated_at: new Date().toISOString()
            })
            .eq("id", authUser.id);

        if (userUpdateError) throw userUpdateError;

        // Update investment transaction
        // We reset created_at to now to renew the term, and last_paid_at to now to restart ROI logic
        const { error: investUpdateError } = await adminSupabase
            .from("transactions")
            .update({
                amount: newInvestAmount,
                created_at: new Date().toISOString(),
                last_paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: 'approved' // Ensure it's still approved
            })
            .eq("id", transactionId);

        if (investUpdateError) throw investUpdateError;

        // 3. Optional: Create a separate log for the top-up itself
        await adminSupabase.from("transactions").insert({
            user_id: authUser.id,
            type: "deposit", // Or "topup" if you add it to enum later
            amount: amount,
            status: "approved",
            plan_id: investment.plan_id,
            created_at: new Date().toISOString()
        });

        // 4. Send Confirmation Email
        try {
            const { sendNewInvestmentEmail } = await import('@/lib/email');
            // Reusing sendNewInvestmentEmail but could create a specific one
            await sendNewInvestmentEmail(authUser.email!, amount.toString(), `Top-up: ${investment.id.slice(0, 8)}`);
        } catch (emailErr) {
            console.error("Top-up email failed:", emailErr);
        }

        return NextResponse.json({ success: true, newAmount: newInvestAmount });

    } catch (err: any) {
        console.error("Top-up error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
