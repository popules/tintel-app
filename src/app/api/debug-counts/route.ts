import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createClient()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Check how many jobs have publishedAt vs created_at
    const { count: countPub, error: err1 } = await supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .gte('publishedAt', thirtyDaysAgo)

    const { count: countCreated, error: err2 } = await supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo)

    const { count: countNullPub, error: err3 } = await supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .is('publishedAt', null)

    return NextResponse.json({
        jobs_with_publishedAt_last_30d: countPub,
        jobs_with_created_at_last_30d: countCreated,
        jobs_with_null_publishedAt: countNullPub,
        errors: { err1, err2, err3 }
    })
}
