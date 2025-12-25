import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import { DailyMatchesEmail } from '@/components/emails/DailyMatches';

export async function GET(req: Request) {
    // 1. Verify cron secret (if set)
    const { searchParams } = new URL(req.url);
    const cronSecret = searchParams.get('secret');

    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();

    try {
        // 2. Fetch candidates with notifications enabled
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, email, role')
            .eq('role', 'candidate');

        if (profileError) throw profileError;

        // 3. For each candidate, find matches (Simplified for now: latest 3 jobs)
        const { data: latestJobs } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (!latestJobs || latestJobs.length === 0) {
            return NextResponse.json({ message: "No new jobs found" });
        }

        const reports = [];

        // 4. Send Emails
        for (const profile of (profiles || [])) {
            if (!profile.email) continue;

            const { data, error } = await resend.emails.send({
                from: 'Tintel <hello@tintel.se>',
                to: profile.email,
                subject: '3 nya jobb på Tintel som matchar din profil',
                react: DailyMatchesEmail({
                    userName: profile.full_name || 'Talang',
                    matches: latestJobs.map(j => ({
                        title: j.title,
                        company: j.company_name,
                        location: j.location,
                        link: `${process.env.NEXT_PUBLIC_APP_URL}/candidate/dashboard`
                    }))
                }),
            });

            if (error) {
                console.error(`Failed to send email to ${profile.email}:`, error);
            } else {
                reports.push({ email: profile.email, id: data?.id });
            }
        }

        return NextResponse.json({
            success: true,
            emailsSent: reports.length,
            reports
        });

    } catch (err: any) {
        console.error("Cron Error:", err);
        return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
    }
}
