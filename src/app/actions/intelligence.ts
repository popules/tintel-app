'use server'

import { createClient } from "@/lib/supabase/server";

export async function getMarketIntelligence() {
    const supabase = createClient();

    try {
        // Fetch Top Aggressive Hirers
        const { data: growing } = await supabase
            .from('company_intelligence')
            .select('*')
            .eq('signal_label', 'Aggressive Hirer')
            .order('hiring_velocity_score', { ascending: false })
            .limit(5);

        // Fetch Top "Leakers" (Cooling Down)
        const { data: slowing } = await supabase
            .from('company_intelligence')
            .select('*')
            .eq('signal_label', 'Cooling Down')
            .order('hiring_velocity_score', { ascending: true }) // Most negative first
            .limit(5);

        // Fetch "Hot Territories" (Aggregate job posts by location in last 30 days)
        // Note: Ideally this would be pre-calculated in a table, but we can do a quick aggregate for now on job_posts
        // OR we can fetch it from a new view. For speed, let's just count recent job posts by location.
        // Since we don't have a 'locations' stats table yet, we'll simulate or do a light query if possible.
        // Supabase REST doesn't do "GROUP BY" easily without an RPC. 
        // Let's use a simple RPC I'll add or just fetch raw counts if volume is low.
        // Actually, let's stay efficient. We'll return just the growing/slowing lists for the "Poaching" signal first.

        return {
            success: true,
            data: {
                growing: growing || [],
                slowing: slowing || []
            }
        };

    } catch (err: any) {
        console.error("Intelligence Fetch Error:", err);
        return { success: false, error: err.message };
    }
}
