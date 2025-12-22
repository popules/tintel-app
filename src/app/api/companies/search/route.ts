import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')

    if (!q || q.length < 2) return NextResponse.json({ results: [] })

    try {
        // Fetch unique company names matching the query
        // We use a broader fetch and aggregate because Supabase doesn't support 'DISTINCT' easily via client
        const { data, error } = await supabase
            .from('job_posts')
            .select('company')
            .ilike('company', `%${q}%`)
            .limit(500)

        if (error) throw error

        const uniqueCompanies = Array.from(new Set(data.map(d => d.company)))
            .slice(0, 10)
            .map(name => ({
                id: name,
                name: name,
                type: 'company'
            }))

        return NextResponse.json({ results: uniqueCompanies })
    } catch (err) {
        return NextResponse.json({ results: [] })
    }
}
