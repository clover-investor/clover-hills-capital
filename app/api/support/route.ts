import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        // Notify Admin
        await resend.emails.send({
            from: "Clover Support <noreply@clovercapitalhills.com>",
            to: ["support@clovercapitalhills.com"], // Hardcoded admin support email or use env
            subject: `New Support Inquiry from ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Support Ticket</h2>
                    <p><strong>Client Name:</strong> ${name}</p>
                    <p><strong>Client Email:</strong> ${email}</p>
                    <p style="margin-top: 20px;"><strong>Inquiry/Message:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000;">
                        ${message}
                    </div>
                </div>
            `
        });

        // Optional: Auto-reply to user
        await resend.emails.send({
            from: "Clover Support <noreply@clovercapitalhills.com>",
            to: [email],
            subject: "We've received your inquiry",
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <p>Hello ${name},</p>
                    <p>Thank you for reaching out to Clover Hills Support. We have received your message regarding:</p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 2px solid #ccc;">${message}</blockquote>
                    <p>One of our account managers will contact you within the next 24 hours.</p>
                    <p>Best regards,<br/>Clover Hills Support Team</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Support API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
