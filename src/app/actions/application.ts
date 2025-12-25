'use server'

import { createClient } from "@/lib/supabase/server";

export type JobSnapshot = {
    id: string; // The external ID (e.g. from JobTech)
    title: string;
    company: string;
    url: string;
    description?: string;
    logo_url?: string;
    deadline?: string;
    location?: string;
};

/**
 * Tracks a candidate's application to a job.
 * Snapshots the job data so it persists even if the source ad expires.
 */
export async function trackApplication(job: JobSnapshot) {
    const supabase = createClient();

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // 2. Insert into 'applications' table
        // We use upsert to prevent duplicates if they click multiple times (idempotency)
        // However, 'id' is auto-generated uuid, so we'd need a composite key or just insert.
        // For now, let's just insert. A unique constraint on (candidate_id, job_id) would be smart in the DB, 
        // but let's handle it gracefully here by checking existence or just letting it convert to an 'update' if we want.

        // Let's check if already applied to keep it clean
        const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('candidate_id', user.id)
            .eq('job_id', job.id)
            .single();

        if (existing) {
            // Already tracked, just update timestamp maybe?
            await supabase
                .from('applications')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', existing.id);

            return { success: true, status: 'updated' };
        }

        // 3. Create new application record
        const { error } = await supabase
            .from('applications')
            .insert({
                candidate_id: user.id,
                job_id: job.id,
                job_title: job.title,
                company_name: job.company,
                job_url: job.url,
                status: 'applied',
                job_data: job, // Full snapshot
                notes: `Applied on ${new Date().toLocaleDateString()}`
            });

        if (error) throw error;

        return { success: true, status: 'created' };

    } catch (error: any) {
        console.error("Track Application Error:", error);
        return { success: false, error: error.message };
    }
}
