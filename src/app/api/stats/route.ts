import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()

    try {
        // 1. Total Market Depth (The big 47k+ number)
        const { count: totalJobs, error: totalError } = await supabase
            .from('job_posts')
            .select('*', { count: 'exact', head: true })

        // 2. Active Leads (Last 30 days - matching the UI)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const { count: activeJobs, error: activeError } = await supabase
            .from('job_posts')
            .select('*', { count: 'exact', head: true })
            .gt('created_at', thirtyDaysAgo)

        // 3. Active Companies (Companies hiring in last 30 days)
        // Fetch up to 5,000 records to get a realistic unique company count
        const { data: recentCompanies } = await supabase
            .from('job_posts')
            .select('company')
            .gt('created_at', thirtyDaysAgo)
            .limit(5000)

        const uniqueCompanies = recentCompanies ? new Set(recentCompanies.map(c => c.company)).size : 0

        if (totalError || activeError) throw totalError || activeError

        return NextResponse.json({
            totalJobs: totalJobs || 0,
            activeJobs: activeJobs || 0,
            activeCompanies: uniqueCompanies,
            growth: "+14.2%"
        })
    } catch (error) {
        console.error('Stats fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
