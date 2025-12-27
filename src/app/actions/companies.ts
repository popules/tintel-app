'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleMonitorCompany(companyName: string) {
    const supabase = createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // 2. Pro Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

    // Allow 'pro' and 'enterprise'. Block 'free'/'starter'
    if (profile?.subscription_tier !== 'pro' && profile?.subscription_tier !== 'enterprise') {
        return { success: false, error: "Upgrade to Pro to monitor companies." };
    }

    // 3. Toggle Logic
    // Check if already monitored
    const { data: existing } = await supabase
        .from('monitored_companies')
        .select('id')
        .eq('user_id', user.id)
        .eq('company_name', companyName)
        .single();

    if (existing) {
        // Remove
        await supabase
            .from('monitored_companies')
            .delete()
            .eq('id', existing.id);

        revalidatePath(`/company/${companyName}`);
        return { success: true, monitored: false };
    } else {
        // Add
        const { error } = await supabase
            .from('monitored_companies')
            .insert({
                user_id: user.id,
                company_name: companyName
            });

        if (error) {
            console.error("Monitor Error", error);
            return { success: false, error: "Failed to monitor company" };
        }

        revalidatePath(`/company/${companyName}`);
        return { success: true, monitored: true };
    }
}

export async function checkMonitorStatus(companyName: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('monitored_companies')
        .select('id')
        .eq('user_id', user.id)
        .eq('company_name', companyName)
        .single();

    return !!data;
}
