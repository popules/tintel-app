import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createClient()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: jobs, error } = await supabase
        .from('job_posts')
        .select('company, publishedAt, created_at')
        .ilike('company', '%SAAB%')
        .gte('publishedAt', thirtyDaysAgo)

    const { data: allSaab, error: err2 } = await supabase
        .from('job_posts')
        .select('company, publishedAt, created_at')
        .ilike('company', '%SAAB%')

    return NextResponse.json({
        activeSaabCount: jobs?.length || 0,
        totalSaabCount: allSaab?.length || 0,
        sample: jobs ? jobs.slice(0, 5) : [],
        error,
        err2
    })
}
