import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transactions: transactions || [] });
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, method, address } = body;

    if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const { data, error } = await supabase.from("transactions").insert({
        user_id: auth.user.id,
        type, // 'deposit' or 'withdrawal'
        amount,
        payment_method: method || null,
        wallet_address: address || null,
        status: 'pending' // Admin must approve
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    try {
        const { sendTransactionRequestEmail } = await import('@/lib/email');
        await sendTransactionRequestEmail((auth.user as any).email, type, Number(amount).toFixed(2));
    } catch (emailErr) {
        console.error("Failed to send transaction email", emailErr);
    }

    return NextResponse.json({ success: true, transaction: data });
}
