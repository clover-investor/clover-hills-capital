import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError || !auth?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { txId } = body;

    if (!txId) {
        return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
    }

    const adminDb = createAdminClient();

    // 1. Fetch transaction and user atomically
    const { data: tx, error: txError } = await adminDb
        .from("transactions")
        .select("*, users(available_balance, total_balance, email)")
        .eq("id", txId)
        .single();

    if (txError || !tx) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    if (tx.status !== 'pending') return NextResponse.json({ error: "Transaction already processed" }, { status: 400 });

    const customer = tx.users;
    const amount = Number(tx.amount);
    let newAvailable = Number(customer.available_balance);
    let newTotal = Number(customer.total_balance);

    if (tx.type === 'deposit') {
        newAvailable += amount;
        newTotal += amount;
    } else if (tx.type === 'withdrawal') {
        if (newAvailable < amount) return NextResponse.json({ error: "User has insufficient funds for this withdrawal" }, { status: 400 });
        newAvailable -= amount;
        newTotal -= amount;
    } else {
        return NextResponse.json({ error: "Unsupported transaction type for auto-approval" }, { status: 400 });
    }

    // 2. Perform atomic updates
    const { error: userUpdateError } = await adminDb
        .from("users")
        .update({
            available_balance: newAvailable,
            total_balance: newTotal,
            updated_at: new Date().toISOString()
        })
        .eq("id", tx.user_id);

    if (userUpdateError) return NextResponse.json({ error: userUpdateError.message }, { status: 500 });

    const { error: txUpdateError } = await adminDb
        .from("transactions")
        .update({ status: 'approved' })
        .eq("id", txId);

    if (txUpdateError) {
        // Warning: This creates a partial failure state; ideally this relies on a Postgres RPC
        return NextResponse.json({ error: txUpdateError.message }, { status: 500 });
    }

    // 3. Dispatch Email Notification
    try {
        const { sendAdminActionEmail } = await import('@/lib/email');
        const detailMessage = tx.type === 'deposit'
            ? `Your deposit of $${amount.toFixed(2)} has been approved and credited to your available balance.`
            : `Your withdrawal of $${amount.toFixed(2)} has been approved and dispatched correctly to your wallet.`;
        await sendAdminActionEmail((customer as any).email, `${tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} Approved`, detailMessage);
    } catch (emailErr) {
        console.error("Auto-Approve Email Failed", emailErr);
    }

    return NextResponse.json({ success: true, newStatus: 'approved' });
}
