'use server'

import { createClient } from "@/lib/supabase/server";

export async function getMatchingJobs(matchCount: number = 5, threshold: number = 0.5) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // 1. Get candidate's embedding
        const { data: embedData, error: embedError } = await supabase
            .from('candidate_embeddings')
            .select('embedding')
            .eq('candidate_id', user.id)
            .single();

        if (embedError || !embedData) {
            console.warn("Matchmaker: No embedding found for candidate", user.id);
            return { success: false, error: "No profile embedding found. Please complete your onboarding." };
        }

        // 2. Clear query: Match embeddings using the RPC function
        const { data: matches, error: matchError } = await supabase.rpc('match_jobs', {
            query_embedding: embedData.embedding,
            match_threshold: threshold,
            match_count: matchCount
        });

        if (matchError) {
            console.error("Matchmaker RPC Error:", matchError);
            return { success: false, error: matchError.message };
        }

        if (!matches || matches.length === 0) {
            return { success: true, data: [] };
        }

        // 3. Fetch full job details for the matches
        const jobIds = matches.map((m: any) => m.job_id);

        const { data: jobs, error: fetchError } = await supabase
            .from('job_posts')
            .select('*')
            .in('id', jobIds);

        if (fetchError) {
            return { success: false, error: fetchError.message };
        }

        // 4. Fetch Intelligence Signals for these companies
        const companyNames = jobs?.map(j => j.company).filter(Boolean) || [];
        const { data: signals } = await supabase
            .from('company_intelligence')
            .select('*')
            .in('company_name', companyNames);

        // Enrich with similarity score and signals
        const enrichedJobs = jobs?.map(job => {
            const match = matches.find((m: any) => String(m.job_id) === String(job.id));
            const signal = signals?.find(s => s.company_name === job.company);

            return {
                ...job,
                match_score: match ? match.similarity : 0,
                signal_label: signal?.signal_label,
                hiring_velocity: signal?.hiring_velocity_score
            };
        }).sort((a, b) => b.match_score - a.match_score);

        return { success: true, data: enrichedJobs };

    } catch (err: any) {
        console.error("Matchmaker Action Error:", err);
        return { success: false, error: err.message };
    }
}
