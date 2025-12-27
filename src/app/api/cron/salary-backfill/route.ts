import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { estimateSalary } from '@/app/actions/salary';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cronSecret = searchParams.get('secret');

    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();
    console.log("[Cron] Starting Salary Backfill...");

    try {
        // 1. Fetch 5 Recent Jobs WITHOUT salary data
        const { data: jobs, error } = await supabase
            .from('job_posts')
            .select('id, title, description, location')
            .is('salary_min', null)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;
        if (!jobs || jobs.length === 0) {
            return NextResponse.json({ success: true, message: "No jobs need salary estimation." });
        }

        console.log(`[Cron] Estimating for ${jobs.length} jobs...`);
        const results = [];

        for (const job of jobs) {
            const estimate = await estimateSalary(job.description || "", job.title || "", job.location || "");

            if (estimate) {
                await supabase
                    .from('job_posts')
                    .update({
                        salary_min: estimate.min,
                        salary_max: estimate.max,
                        salary_currency: estimate.currency,
                        salary_period: estimate.period
                    })
                    .eq('id', job.id);

                results.push({ id: job.id, estimate });
            } else {
                // Mark as processed (or handle failure to avoid infinite loop)
                // For now, we leave it null so it might be retried or we should add a 'salary_checked' flag.
                // To prevent infinite loops on un-estimatable jobs, ideally we set a flag.
                // But for this MVP, let's just log it.
                console.warn(`[Cron] Could not estimate salary for job ${job.id}`);
            }
        }

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (err: any) {
        console.error("[Cron] Salary Backfill Error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
