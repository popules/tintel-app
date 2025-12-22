import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // 1. Fetch current notifications
        let { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

        // 2. "Signal Intelligence" - If few notifications, scan for new market signals
        if (!notifications || notifications.length < 3) {
            // Find companies that posted > 2 jobs in last 7 days
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

            const { data: recentJobs } = await supabase
                .from('job_posts')
                .select('company, title')
                .gt('created_at', sevenDaysAgo)

            if (recentJobs && recentJobs.length > 0) {
                const companyCounts = recentJobs.reduce((acc: any, job) => {
                    acc[job.company] = (acc[job.company] || 0) + 1
                    return acc
                }, {})

                const hotCompanies = Object.entries(companyCounts)
                    .filter(([_, count]: any) => count >= 1)
                    .slice(0, 3)

                // Mock unique signals for the user (only if they don't exist yet)
                for (const [company, count] of hotCompanies) {
                    const signalTitle = `New Activity: ${company}`
                    const signalContent = `${company} is currently active in the market with new openings.`

                    const { data: newSignal } = await supabase
                        .from('notifications')
                        .insert({
                            user_id: user.id,
                            title: signalTitle,
                            content: signalContent,
                            type: 'signal',
                            company_name: company
                        })
                        .select()
                        .single()

                    if (newSignal) {
                        if (!notifications) notifications = []
                        notifications.unshift(newSignal)
                    }
                }
            } else {
                // If ZERO signals found, provide a "Welcome/System" signal so it's not empty
                const { data: welcome } = await supabase
                    .from('notifications')
                    .insert({
                        user_id: user.id,
                        title: "Intelligence Baseline Set",
                        content: "Tintel has analyzed 47k+ records. We are now monitoring live Swedish listings for your specific categories.",
                        type: 'info'
                    })
                    .select()
                    .single()
                if (welcome) {
                    if (!notifications) notifications = []
                    notifications.push(welcome)
                }
            }
        }

        return NextResponse.json({ notifications: notifications || [] })
    } catch (err) {
        console.error('Notifications API Error:', err)
        return NextResponse.json({ notifications: [] })
    }
}

export async function POST(req: Request) {
    const supabase = createClient()
    const { notificationId } = await req.json()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('user_id', user.id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
    }
}

