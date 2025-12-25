'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function unlockCandidateProfile(candidateId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .rpc('unlock_candidate', { target_candidate_id: candidateId });

    if (error) {
        console.error("Unlock Error:", error);
        return { success: false, error: error.message };
    }

    // data structure specified in the SQL function:
    // jsonb_build_object('success', true, 'remaining', current_credits - 1, 'source', 'credit');

    if (data && data.success) {
        revalidatePath('/company/dashboard');
        return {
            success: true,
            remainingCredits: data.remaining,
            source: data.source // 'credit' or 'subscription'
        };
    } else {
        return {
            success: false,
            error: data?.message || 'insufficient_credits'
        };
    }
}
