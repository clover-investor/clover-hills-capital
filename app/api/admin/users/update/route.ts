import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: user } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { userId, updates } = body;

    const adminDb = createAdminClient();

    // Pre-fetch user to compare balance changes
    let oldUser: any = null;
    if (updates.available_balance || updates.total_balance || updates.invested) {
        const { data } = await adminDb.from("users").select("*").eq("id", userId).single();
        oldUser = data;
    }

    const { error } = await adminDb.from("users").update(updates).eq("id", userId);

    if (!error && oldUser) {
        let details = [];
        if (updates.available_balance && Number(updates.available_balance) > Number(oldUser.available_balance)) {
            details.push(`Available balance increased to $${updates.available_balance}`);
        }
        if (updates.invested && Number(updates.invested) > Number(oldUser.invested)) {
            details.push(`Active capital increased to $${updates.invested}`);
        }
        if (details.length > 0) {
            const { sendAdminActionEmail } = await import('@/lib/email');
            await sendAdminActionEmail(oldUser.email, "Balance Credit", details.join(". "));
        }
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
