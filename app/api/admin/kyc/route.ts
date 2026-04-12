import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: user } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminDb = createAdminClient();

    // Note: users!inner requires proper foreign keys, falling back to a structured join
    // if not available, but since we created user_id REFERENCES users(id), this works.
    const { data: kyc, error } = await adminDb.from("kyc").select("*, users(full_name, email)").order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ kyc: kyc || [] });
}

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: user } = await supabase.from("users").select("role").eq("id", auth.user.id).single();
    if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { action, kycId } = body;

    const adminDb = createAdminClient();
    const status = action === "approve" ? "approved" : "rejected";

    // Grab user details before update so we can email them
    const { data: kycRec } = await adminDb.from("kyc").select("user_id").eq("id", kycId).single();
    let targetUser = null;
    if (kycRec) {
        const { data } = await adminDb.from("users").select("email, full_name").eq("id", kycRec.user_id).single();
        targetUser = data;
    }

    const { error } = await adminDb.from("kyc").update({ status }).eq("id", kycId);

    if (!error && targetUser) {
        try {
            const { sendAdminActionEmail } = await import("@/lib/email");
            if (status === "approved") {
                await sendAdminActionEmail(
                    targetUser.email,
                    "KYC Verification Approved",
                    "Your identity verification documents have been successfully reviewed and approved. Your account is now fully verified and restrictions have been lifted."
                );
            } else {
                await sendAdminActionEmail(
                    targetUser.email,
                    "KYC Verification Declined",
                    "Unfortunately, we could not verify the identity documents provided. Please review the requirements on your dashboard and submit a new application, or contact our support team for assistance."
                );
            }
        } catch (emailErr) {
            console.error("Failed to send KYC email:", emailErr);
        }
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
