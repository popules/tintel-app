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

        // 1. Add to monitored_companies (Attempt with fallback)
        let tableMissing = false
        const { error: monitorError } = await supabase
            .from('monitored_companies')
            .upsert({
                user_id: user.id,
                company_name: companyName
            }, { onConflict: 'user_id, company_name' })

        if (monitorError && monitorError.code === '42P01') {
            tableMissing = true
            console.warn("monitored_companies table missing. Falling back to notification only.")
        } else if (monitorError) {
            throw monitorError
        }

        // 2. Trigger notification (Real UI feedback)
        await supabase.from('notifications').insert({
            user_id: user.id,
            title: `Monitoring ${companyName}`,
            content: tableMissing
                ? `You are now monitoring ${companyName}. (Action: Admin needs to run monitored_companies.sql to enable persistence)`
                : `You are now monitoring ${companyName}. We'll notify you of significant hiring signals.`,
            type: 'signal'
        })

        return NextResponse.json({ success: true, tableMissing })
    } catch (err: any) {
        console.error("Monitor Error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ monitored: [] })

    try {
        const { data, error } = await supabase
            .from('monitored_companies')
            .select('company_name')
            .eq('user_id', user.id)

        if (error && error.code === '42P01') {
            return NextResponse.json({ monitored: [], tableMissing: true })
        }

        return NextResponse.json({ monitored: data?.map(d => d.company_name) || [] })
    } catch (err) {
        return NextResponse.json({ monitored: [] })
    }
}
