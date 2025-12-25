'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function ensureAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/company/dashboard')
    }

    return { supabase, user }
}

export async function getAdminStats() {
    const { supabase } = await ensureAdmin()

    // 1. Total Users
    const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // 2. Candidates vs Recruiters
    const { count: candidateCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'candidate')

    const { count: recruiterCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'recruiter')

    // 3. Newest signups
    const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at, email') // Note: email might need a join or be in profiles
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        totalUsers: userCount || 0,
        candidates: candidateCount || 0,
        recruiters: recruiterCount || 0,
        recentUsers: recentUsers || []
    }
}
