import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/utils/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        // 1. Save to Database (Support Inbox)
        const adminDb = createAdminClient();
        const { error: dbError } = await adminDb.from("support_tickets").insert({
            name,
            email,
            message,
            status: 'pending'
        });

        if (dbError) {
            console.error("Support DB Error:", dbError);
            return NextResponse.json({ error: "Failed to log inquiry" }, { status: 500 });
        }

        // 2. Auto-reply to user (Receipt Confirmation)
        try {
            await resend.emails.send({
                from: "Clover Hills <noreply@clovercapitalhills.com>",
                to: [email],
                subject: "Inquiry Received — Clover Hills",
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333; background: #fafafa; border: 1px solid #eee;">
                        <h3 style="color: #000; letter-spacing: 0.1em; text-transform: uppercase;">Reference: Support Ticket</h3>
                        <p>Hello ${name},</p>
                        <p>Thank you for contacting our concierge team. We have received your inquiry regarding:</p>
                        <blockquote style="background: #fff; padding: 15px; border-left: 3px solid #000; font-style: italic;">"${message}"</blockquote>
                        <p>Our team is reviewing your request and will contact you directly via this email address within 24 hours.</p>
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
                        <p style="font-size: 11px; color: #888;">Clover Hills Institutional Asset Management</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error("Auto-reply Email Failed", emailErr);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Support API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
