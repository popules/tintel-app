import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // 1. Fetch user's territory preferences
        const { data: profile } = await supabase
            .from('profiles')
            .select('territories')
            .eq('id', user.id)
            .single()

        const myTerritories = profile?.territories || []

        // 2. Scan last 7 days vs 30 days for signals
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

        // Fetch all jobs in the 30d window (Deep Fetch)
        let allJobs: any[] = []
        let hasMore = true
        let page = 0
        const pageSize = 1000

        while (hasMore && page < 20) {
            const { data, error } = await supabase
                .from('job_posts')
                .select('company, location, county, broad_category, created_at')
                .gte('created_at', thirtyDaysAgo)
                .range(page * pageSize, (page + 1) * pageSize - 1)

            if (error) throw error
            if (!data || data.length < pageSize) hasMore = false
            if (data) allJobs = [...allJobs, ...data]
            page++
        }

        // 3. Detect Signals
        const companyStats: Record<string, { total30d: number, total7d: number, counties: Set<string> }> = {}

        allJobs.forEach(job => {
            const name = job.company
            if (!companyStats[name]) {
                companyStats[name] = { total30d: 0, total7d: 0, counties: new Set() }
            }
            companyStats[name].total30d++
            if (job.created_at >= sevenDaysAgo) {
                companyStats[name].total7d++
            }
            if (job.county) {
                companyStats[name].counties.add(job.county)
            }
        })

        const newNotifications: any[] = []

        for (const [name, stats] of Object.entries(companyStats)) {
            // A. SURGE SIGNAL: 7-day volume > 250% of the 30-day "weekly" average
            // (Total30d / 4) * 2.5
            const weeklyAvg = stats.total30d / 4
            if (stats.total7d > weeklyAvg * 2.5 && stats.total7d > 3) {
                // Check if this surge is in the user's territories (Counties)
                const isRelevant = myTerritories.length === 0 || Array.from(stats.counties).some(c => myTerritories.includes(c))

                if (isRelevant) {
                    newNotifications.push({
                        user_id: user.id,
                        title: `Hiring Surge: ${name}`,
                        content: `${name} has posted ${stats.total7d} new roles in the last week. This is significantly above their normal volume.`,
                        type: 'signal',
                        is_read: false
                    })
                }
            }
        }

        // 4. Batch insert new notifications
        if (newNotifications.length > 0) {
            // To prevent notification spam, we could check if we already sent a similar notification recently
            // For now, let's just insert
            await supabase.from('notifications').insert(newNotifications.slice(0, 5)) // Limit to top 5
        }

        return NextResponse.json({
            success: true,
            signalsDetected: newNotifications.length,
            territoriesScanned: myTerritories
        })

    } catch (err: any) {
        console.error("Signal Engine Error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
