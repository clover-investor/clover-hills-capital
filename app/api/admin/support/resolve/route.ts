import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: user } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { ticketId, status } = await req.json();
    if (!ticketId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const adminDb = createAdminClient();
    const { error } = await adminDb
        .from("support_tickets")
        .update({ status })
        .eq("id", ticketId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
