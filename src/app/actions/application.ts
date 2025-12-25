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
    created_at?: string;
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
        // Check existence to prevent duplicates
        const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('candidate_id', user.id)
            .eq('job_id', job.id)
            .single();

        if (existing) {
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
                status: 'saved',
                job_data: job, // Full snapshot
                notes: `Saved on ${new Date().toLocaleDateString()}`
            });

        if (error) throw error;

        return { success: true, status: 'created' };

    } catch (error: any) {
        console.error("Track Application Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Updates the status of an application (e.g. Applied -> Interview)
 */
export async function updateApplicationStatus(applicationId: string, status: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const { error } = await supabase
            .from('applications')
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', applicationId)
            .eq('candidate_id', user.id); // Security: Ensure ownership

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
