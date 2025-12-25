import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // In production, you would check for a CRON_SECRET header
    // if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse('Unauthorized', { status: 401 });
    // }

    const supabase = createClient();

    // 1. Get all candidates who have an embedding
    const { data: candidates, error: candidateError } = await supabase
        .from('candidate_embeddings')
        .select('candidate_id, embedding')
        // Optimisation: We could limit this or paginate for scale
        .limit(50);

    if (candidateError) {
        return NextResponse.json({ error: candidateError.message }, { status: 500 });
    }

    const matchesFound = [];

    // 2. For each candidate, find matches
    for (const candidate of candidates) {
        // match_jobs RPC: query_embedding, match_threshold, match_count
        const { data: jobs, error: matchError } = await supabase
            .rpc('match_jobs', {
                query_embedding: candidate.embedding,
                match_threshold: 0.78, // High threshold for "Daily Picks"
                match_count: 3
            });

        if (matchError) continue;

        if (jobs && jobs.length > 0) {
            // 3. Create Notification
            // Check if we already notified about these jobs recently? 
            // For MVP, we just create a "Daily Mix" notification

            const { error: notifyError } = await supabase
                .from('notifications')
                .insert({
                    user_id: candidate.candidate_id,
                    title: '🎯 Daily Match Mix',
                    content: `We found ${jobs.length} new jobs that match your profile.`,
                    type: 'match',
                    link: '/candidate/dashboard' // In future: Deep link to specific match list
                });

            if (!notifyError) {
                matchesFound.push({ candidateId: candidate.candidate_id, jobCount: jobs.length });
            }
        }
    }

    return NextResponse.json({
        success: true,
        processed: candidates.length,
        matches: matchesFound
    });
}
