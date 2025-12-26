import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import { DailyMatchesEmail } from '@/components/emails/DailyMatches';
import { en } from '@/locales/en';
import { sv } from '@/locales/sv';

export async function GET(req: Request) {
    // 1. Verify cron secret (if set)
    const { searchParams } = new URL(req.url);
    const cronSecret = searchParams.get('secret');
    const testEmail = searchParams.get('test_email'); // NEW: Debug specific email

    console.log(`[Cron] Starting Daily Match. Test Mode: ${testEmail ? 'ON' : 'OFF'}`);

    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        console.warn(`[Cron] Unauthorized access attempt.`);
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();

    try {
        // 2. Fetch candidates
        console.log(`[Cron] Fetching profiles...`);
        let query = supabase
            .from('profiles')
            .select('id, full_name, email, role, preferred_language')
            .in('role', ['candidate', 'CANDIDATE']); // Handle case sensitivity

        if (testEmail) {
            query = query.eq('email', testEmail);
        } else {
            query = query.eq('role', 'candidate'); // Default to strict if not testing? Actually sticking to .in is safer for all.
            // Re-apply .in properly for the bulk run
            query = supabase
                .from('profiles')
                .select('id, full_name, email, role, preferred_language')
                .in('role', ['candidate', 'CANDIDATE']);
        }

        // Apply test filter if provided (User might want to test 'role' logic even with test_email, but let's prioritize finding the user)
        if (testEmail) {
            query = supabase
                .from('profiles')
                .select('id, full_name, email, role, preferred_language')
                .eq('email', testEmail);
        }

        const { data: profiles, error: profileError } = await query;

        if (profileError) {
            console.error(`[Cron] Profile fetch error:`, profileError);
            throw profileError;
        }

        console.log(`[Cron] Found ${profiles?.length || 0} candidates.`);

        if (!profiles || profiles.length === 0) {
            return NextResponse.json({ message: "No candidates found matching criteria." });
        }

        // 3. For each candidate, find matches
        const { data: latestJobs, error: jobError } = await supabase
            .from('job_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (jobError) {
            console.error(`[Cron] Job fetch error:`, jobError);
            throw jobError;
        }

        if (!latestJobs || latestJobs.length === 0) {
            console.log(`[Cron] No jobs found.`);
            return NextResponse.json({ message: "No new jobs found." });
        }

        const reports = [];

        // 4. Send Emails
        for (const profile of profiles) {
            if (!profile.email) {
                console.warn(`[Cron] Skipping user ${profile.id} (No email)`);
                continue;
            }

            console.log(`[Cron] Processing user: ${profile.email}`);

            const locale = (profile.preferred_language === 'sv' || profile.preferred_language === 'en') ? profile.preferred_language : 'en';
            // Temporary debug: hardcode subject to see if 't' access is the crash
            const subject = locale === 'sv' ? "3 nya matchningar på Tintel" : "3 new jobs on Tintel matching your profile";

            try {
                console.log(`[Cron] Preparing email for ${profile.email} (Locale: ${locale})`);
                const { data, error } = await resend.emails.send({
                    from: 'Tintel <hello@tintel.se>',
                    to: profile.email,
                    subject: subject,
                    react: DailyMatchesEmail({
                        userName: profile.full_name || 'Talang',
                        matches: latestJobs.map(j => ({
                            title: j.title || 'Jobbmöjlighet',
                            company: j.company || 'Företag',
                            location: j.location || 'Sverige',
                            link: j.webbplatsurl || `${process.env.NEXT_PUBLIC_APP_URL}/candidate/dashboard`
                        })),
                        locale: locale
                    }),
                });

                if (error) {
                    console.error(`[Cron] Resend Error for ${profile.email}:`, error);
                    reports.push({ email: profile.email, status: 'error', error });
                } else {
                    console.log(`[Cron] Success: ${profile.email} (ID: ${data?.id})`);
                    reports.push({ email: profile.email, status: 'sent', id: data?.id });
                }
            } catch (emailErr: any) {
                console.error(`[Cron] Unexpected email error for ${profile.email}:`, emailErr);
                reports.push({
                    email: profile.email,
                    status: 'failed',
                    error: emailErr.message || String(emailErr)
                });
            }
        }

        return NextResponse.json({
            success: true,
            candidatesFound: profiles.length,
            emailsSent: reports.filter(r => r.status === 'sent').length,
            reports
        });

    } catch (err: any) {
        console.error("[Cron] Critical Failure:", err);
        return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
    }
}
