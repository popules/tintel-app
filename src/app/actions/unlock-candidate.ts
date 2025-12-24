'use server'

import { createClient } from "@/lib/supabase/server";

export type UnlockResult =
    | { success: true; remainingCredits: number }
    | { success: false; error: 'no_session' | 'no_profile' | 'insufficient_credits' | 'server_error' };

export async function unlockCandidateProfile(): Promise<UnlockResult> {
    const supabase = createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'no_session' };

        // 1. Fetch Profile & Credits
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits_remaining, membership_tier')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error("Profile fetch error:", profileError);
            return { success: false, error: 'no_profile' };
        }

        // 2. Check Credits
        // If they are unlimited (e.g. Enterprise), we might skip this. 
        // For now everyone pays 1 credit.
        if (profile.credits_remaining < 1) {
            return { success: false, error: 'insufficient_credits' };
        }

        // 3. Decrement Credits
        const { error: updateError, data: updatedProfile } = await supabase
            .from('profiles')
            .update({ credits_remaining: profile.credits_remaining - 1 })
            .eq('id', user.id)
            .select('credits_remaining')
            .single();

        if (updateError) {
            console.error("Credit update error:", updateError);
            return { success: false, error: 'server_error' };
        }

        return {
            success: true,
            remainingCredits: updatedProfile.credits_remaining
        };

    } catch (err) {
        console.error("Unexpected error in unlockCandidateProfile:", err);
        return { success: false, error: 'server_error' };
    }
}
