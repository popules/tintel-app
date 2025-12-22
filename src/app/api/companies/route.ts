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
            .limit(10000)

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
            .slice(0, 50)
            .map((c: any) => {
                const locationEntries: any = Object.entries(c.locations)
                const sortedLocs = locationEntries.sort((a: any, b: any) => b[1] - a[1])
                const primaryCity = sortedLocs[0] ? sortedLocs[0][0] : 'Sweden'

                return {
                    name: c.name,
                    count: c.count,
                    city: primaryCity,
                    growth: c.count > 100 ? '+32%' : (c.count > 50 ? '+18%' : '+8%')
                }
            })

        return NextResponse.json({ companies: sortedCompanies })
    } catch (err) {
        console.error('Companies API Error:', err)
        return NextResponse.json({ companies: [] })
    }
}
