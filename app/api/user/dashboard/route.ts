import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user balances
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("total_balance, available_balance, invested, earnings, referral_code")
        .eq("id", auth.user.id)
        .single();

    if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Get active investments
    const { data: investments } = await supabase
        .from("transactions")
        .select(`
            id, 
            amount, 
            status, 
            created_at, 
            duration_days, 
            top_up_frequency,
            plans (
                name,
                daily_roi
            )
        `)
        .eq("user_id", auth.user.id)
        .eq("type", "investment")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

    // Get recent transactions
    const { data: transactions } = await supabase
        .from("transactions")
        .select("id, type, amount, status, created_at")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

    return NextResponse.json({
        user,
        transactions: transactions || [],
        investments: investments || [],
    });
}
