import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { to, fullName } = await req.json();
        if (to && fullName) {
            await sendWelcomeEmail(to, fullName);
        }
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
