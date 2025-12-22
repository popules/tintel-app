import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createClient()

    try {
        // Fetch a large sample or aggregate if possible
        // For Supabase, without a view or custom function, we can't easily do GROUP BY in one call
        // However, we can fetch recent records and aggregate in JS for now, or just return 
        // a curated list of companies that we KNOW exist.

        // Let's try to get a sample of 2000 recent jobs to see who is hiring
        const { data: jobs, error } = await supabase
            .from('job_posts')
            .select('company, location')
            .order('created_at', { ascending: false })
            .limit(1000)

        if (error) throw error

        const companyInfo = (jobs || []).reduce((acc: any, job) => {
            if (!acc[job.company]) {
                acc[job.company] = {
                    name: job.company,
                    count: 0,
                    city: job.location || 'Sweden',
                    sector: 'Industry'
                }
            }
            acc[job.company].count += 1
            return acc
        }, {})

        const sortedCompanies = Object.values(companyInfo)
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 50)
            .map((c: any) => ({
                ...c,
                growth: c.count > 5 ? '+15%' : '+5%' // Simple mock growth for now
            }))

        return NextResponse.json({ companies: sortedCompanies })
    } catch (err) {
        console.error('Companies API Error:', err)
        return NextResponse.json({ companies: [] })
    }
}
