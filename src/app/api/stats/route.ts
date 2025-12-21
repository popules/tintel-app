import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createClient()

    try {
        // 1. Get Total Jobs (Market Depth)
        const { count: totalJobs, error: totalError } = await supabase
            .from('job_posts')
            .select('*', { count: 'exact', head: true })

        // 2. Get Active Jobs (last 30 days)
        const thirtyDaysAgo = new Set([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()])
        const { count: activeJobs, error: activeError } = await supabase
            .from('job_posts')
            .select('*', { count: 'exact', head: true })
            .gt('created_at', Array.from(thirtyDaysAgo)[0])

        // 3. Get Unique Companies
        const { data: companies, error: companyError } = await supabase
            .from('job_posts')
            .select('company')

        const uniqueCompanies = companies ? new Set(companies.map(c => c.company)).size : 0

        if (totalError || activeError) throw totalError || activeError

        return NextResponse.json({
            totalJobs: totalJobs || 0,
            activeJobs: activeJobs || 0,
            activeCompanies: uniqueCompanies,
            // Mocking these for now as they depend on the 'saved_jobs' and 'outreach' tables
            newLeads: 45,
            outreachSuccess: "85%"
        })
    } catch (error) {
        console.error('Stats fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
}
