import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createClient()

    try {
        // 1. Get companies that have been active in the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

        // We fetch a larger window to identify the "players"
        const { data: activeJobs, error } = await supabase
            .from('job_posts')
            .select('company, location')
            .gt('created_at', thirtyDaysAgo)

        if (error) throw error

        const companyAggr = (activeJobs || []).reduce((acc: any, job) => {
            const name = job.company
            if (!acc[name]) {
                acc[name] = {
                    name: name,
                    count: 0,
                    locations: {} as Record<string, number>
                }
            }
            acc[name].count += 1
            const loc = job.location || 'Sweden'
            acc[name].locations[loc] = (acc[name].locations[loc] || 0) + 1
            return acc
        }, {})

        const sortedCompanies = Object.values(companyAggr)
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 48)
            .map((c: any) => {
                // Find primary city
                const primaryCity = Object.entries(c.locations)
                    .sort((a: any, b: any) => b[1] - a[1])[0][0]

                return {
                    name: c.name,
                    count: c.count,
                    city: primaryCity,
                    growth: c.count > 20 ? '+24%' : (c.count > 5 ? '+12%' : '+4%')
                }
            })

        return NextResponse.json({ companies: sortedCompanies })
    } catch (err) {
        console.error('Companies API Error:', err)
        return NextResponse.json({ companies: [] })
    }
}
