import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth, error } = await supabase.auth.getUser();
    if (error || !auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: user } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { action, planId, newPlan } = body;

    const adminDb = createAdminClient();

    if (action === "create") {
        const { data, error: insertError } = await adminDb.from("plans").insert(newPlan).select().single();
        if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
        return NextResponse.json({ success: true, plan: data });
    }

    if (action === "delete" && planId) {
        const { error: delError } = await adminDb.from("plans").delete().eq("id", planId);
        if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
