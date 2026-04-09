import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const documentFile = formData.get("document") as File;
    const selfieFile = formData.get("selfie") as File;

    if (!documentFile || !selfieFile) {
        return NextResponse.json({ error: "Both files are required" }, { status: 400 });
    }

    const adminDb = createAdminClient();

    // Upload ID document
    const docExtension = documentFile.name.split('.').pop();
    const docPath = `${auth.user.id}/document_${Date.now()}.${docExtension}`;
    const { error: docError } = await adminDb.storage
        .from("kyc_documents")
        .upload(docPath, documentFile, { upsert: true });

    if (docError) {
        return NextResponse.json({ error: `Document upload failed: ${docError.message}` }, { status: 500 });
    }

    // Upload selfie
    const selfieExtension = selfieFile.name.split('.').pop();
    const selfiePath = `${auth.user.id}/selfie_${Date.now()}.${selfieExtension}`;
    const { error: selfieError } = await adminDb.storage
        .from("kyc_documents")
        .upload(selfiePath, selfieFile, { upsert: true });

    if (selfieError) {
        return NextResponse.json({ error: `Selfie upload failed: ${selfieError.message}` }, { status: 500 });
    }

    // Get signed URLs (valid for 10 years - admin will use these to view)
    const { data: docUrl } = await adminDb.storage
        .from("kyc_documents")
        .createSignedUrl(docPath, 60 * 60 * 24 * 365 * 10);

    const { data: selfieUrl } = await adminDb.storage
        .from("kyc_documents")
        .createSignedUrl(selfiePath, 60 * 60 * 24 * 365 * 10);

    // Check if KYC record already exists
    const { data: existingKyc } = await adminDb
        .from("kyc")
        .select("id")
        .eq("user_id", auth.user.id)
        .single();

    if (existingKyc) {
        // Update existing record
        const { error: updateError } = await adminDb
            .from("kyc")
            .update({
                document_url: docUrl?.signedUrl,
                selfie_url: selfieUrl?.signedUrl,
                status: "pending",
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", auth.user.id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
    } else {
        // Insert new KYC record
        const { error: insertError } = await adminDb
            .from("kyc")
            .insert({
                user_id: auth.user.id,
                document_url: docUrl?.signedUrl,
                selfie_url: selfieUrl?.signedUrl,
                status: "pending",
            });

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true });
}

export async function GET() {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: kyc } = await supabase
        .from("kyc")
        .select("status, created_at")
        .eq("user_id", auth.user.id)
        .single();

    return NextResponse.json({ kyc });
}
