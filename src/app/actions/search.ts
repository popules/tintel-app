'use server'

import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/app/actions/ai";

export async function searchCandidates(query: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Defense in Depth: Check if user is a recruiter
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, subscription_tier')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'recruiter') {
        return { success: false, error: "Only recruiters can search candidates." };
    }

    // Gating: Only Pro or Enterprise can use Vector Search
    if (profile?.subscription_tier !== 'pro' && profile?.subscription_tier !== 'enterprise') {
        return {
            success: false,
            error: "Standard Search is available. Upgrade to Pro for AI Vector Search."
        };
    }

    try {
        // 1. Generate Embedding for the Search Query
        const embedResult = await generateEmbedding(query);

        if (!embedResult.success || !embedResult.data) {
            return { success: false, error: embedResult.error || "Failed to generate embedding" };
        }

        const queryEmbedding = embedResult.data;

        // 2. Run Vector Similarity Search (RPC call)
        const { data: matches, error } = await supabase.rpc('match_candidates', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5, // 50% similarity minimum
            match_count: 5 // Top 5 results
        });

        if (error) {
            console.error("Vector Search RPC Error:", error);
            return { success: false, error: error.message };
        }

        if (!matches || matches.length === 0) {
            return { success: true, data: [] };
        }

        // 3. Fetch Full Candidate Profiles for the Matches
        const candidateIds = matches.map((m: any) => m.candidate_id);

        const { data: candidates, error: fetchError } = await supabase
            .from('candidates')
            .select('*')
            .in('id', candidateIds);

        if (fetchError) {
            return { success: false, error: fetchError.message };
        }

        // Merge similarity score into the candidate object for UI display
        const enrichedCandidates = candidates?.map(c => {
            const match = matches.find((m: any) => m.candidate_id === c.id);
            return { ...c, match_score: match ? match.similarity : 0 };
        }).sort((a, b) => b.match_score - a.match_score); // Ensure sorted by score

        return { success: true, data: enrichedCandidates };

    } catch (err: any) {
        console.error("Search Action Error:", err);
        return { success: false, error: err.message };
    }
}
