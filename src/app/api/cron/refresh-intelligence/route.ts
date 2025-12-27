import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cronSecret = searchParams.get('secret');

    // Basic security check (if CRON_SECRET is set in env)
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();
    console.log("[Cron] Refreshing Market Intelligence...");

    try {
        // Call the Database Function acting as the engine
        const { error } = await supabase.rpc('refresh_market_intelligence');

        if (error) {
            console.error("[Cron] Failed to refresh intelligence:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        console.log("[Cron] Market Intelligence Refreshed Successfully.");
        return NextResponse.json({ success: true, message: "Engine refreshed." });

    } catch (err: any) {
        console.error("[Cron] Critical Failure:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
