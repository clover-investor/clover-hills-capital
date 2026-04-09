import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const maxDuration = 60; // Allows up to 60s execution

export async function GET(req: Request) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const adminDb = createAdminClient();

    // 2. Call the Postgres RPC function to process ROI securely, atomically, and optimally
    // This fully prevents duplicates, floating point errors, and N+1 queries.
    const { data: processedCount, error } = await adminDb.rpc('process_daily_roi');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        message: `Successfully processed ${processedCount} investments in database transaction.`,
        success: true
    }, { status: 200 });
}
