import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { companyName } = await req.json()
        if (!companyName) throw new Error("Company name is required")

        // 1. Add to monitored_companies
        // We use upsert to handle duplicates gracefully
        const { error } = await supabase
            .from('monitored_companies')
            .upsert({
                user_id: user.id,
                company_name: companyName
            }, { onConflict: 'user_id, company_name' })

        if (error) throw error

        // 2. We can also trigger a notification for the feed
        await supabase.from('notifications').insert({
            user_id: user.id,
            title: `Monitoring ${companyName}`,
            content: `You are now monitoring ${companyName}. We'll notify you of significant hiring signals.`,
            type: 'signal'
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error("Monitor Error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ monitored: [] })

    const { data } = await supabase
        .from('monitored_companies')
        .select('company_name')
        .eq('user_id', user.id)

    return NextResponse.json({ monitored: data?.map(d => d.company_name) || [] })
}
