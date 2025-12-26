
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import { getDailyMatchesHtml, getTalentAlertHtml } from '@/lib/email-templates';
import { en } from '@/locales/en';
import { sv } from '@/locales/sv';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cronSecret = searchParams.get('secret');
    const testEmail = searchParams.get('test_email');

    console.log(`[Cron] Starting Daily Match. Test Mode: ${testEmail ? 'ON' : 'OFF'}`);

    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
        console.warn(`[Cron] Unauthorized access attempt.`);
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();
    const reports = [];

    try {
        // ==========================================
        // 1. CANDIDATE MATCHING (Jobs -> Candidates)
        // ==========================================
        console.log(`[Cron] Fetching candidates...`);

        let candidateQuery = supabase
            .from('profiles')
            .select('id, full_name, email, role, preferred_language')
            .in('role', ['candidate', 'CANDIDATE']);

        if (testEmail) {
            candidateQuery = supabase.from('profiles').select('id, full_name, email, role, preferred_language').eq('email', testEmail);
        }

        const { data: candidates, error: candidateError } = await candidateQuery;

        if (candidateError) throw candidateError;

        if (candidates && candidates.length > 0) {
            // Fetch recent jobs (Global "New Jobs" for now - smart matching comes later)
            const { data: latestJobs } = await supabase
                .from('job_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (latestJobs && latestJobs.length > 0) {
                // Determine App URL
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tintel.se';

                for (const profile of candidates) {
                    if (!profile.email) continue;

                    // Manual Locale Selection & Text Extraction
                    // forcing 'en' or 'sv' ensures type safety with our dictionaries
                    const userLocale = (profile.preferred_language === 'sv') ? 'sv' : 'en';
                    const dictionary = (userLocale === 'sv') ? sv : en;
                    const emailDict = dictionary.emails.daily_matches;

                    const subject = emailDict.subject;

                    try {
                        const htmlContent = getDailyMatchesHtml({
                            userName: profile.full_name || 'Candidate',
                            matches: latestJobs.map(j => ({
                                title: j.title || 'Job Opening',
                                company: j.company || 'Company',
                                location: j.location || 'Sweden',
                                link: j.webbplatsurl || `${appUrl}/candidate/dashboard`
                            })),
                            texts: {
                                preview: emailDict.preview.replace('{{count}}', String(latestJobs.length)),
                                greeting: emailDict.greeting.replace('{{name}}', profile.full_name || 'Candidate'),
                                pre_summary: emailDict.body_pre,
                                post_summary: emailDict.body_post,
                                button: emailDict.button,
                                reason: emailDict.footer_reason,
                                settings: emailDict.footer_settings,
                                unsubscribe: emailDict.unsubscribe || "Unsubscribe"
                            },
                            links: {
                                home: appUrl,
                                settings: `${appUrl}/dashboard/settings`
                            }
                        });

                        const { data, error } = await resend.emails.send({
                            from: 'Tintel <hello@tintel.se>',
                            to: profile.email,
                            subject: subject,
                            html: htmlContent
                        });

                        if (error) {
                            console.error(`[Cron] Resend Error for ${profile.email}:`, error);
                            reports.push({ email: profile.email, type: 'candidate_digest', status: 'failed', error: error.message });
                        } else {
                            reports.push({ email: profile.email, type: 'candidate_digest', status: 'sent', id: data?.id });
                        }

                    } catch (err: any) {
                        console.error(`[Cron] System Error for ${profile.email}:`, err);
                        reports.push({ email: profile.email, type: 'candidate_digest', status: 'failed', error: err.message || String(err) });
                    }
                }
            }
        }

        // ==========================================
        // 2. RECRUITER MATCHING (Candidates -> Recruiters)
        // ==========================================
        console.log(`[Cron] Fetching recruiters...`);
        let recruiterQuery = supabase
            .from('profiles')
            .select('id, full_name, email, role, preferred_language')
            .in('role', ['recruiter', 'RECRUITER']); // Standardized role check

        if (testEmail) {
            // For testing, we might want to pretend the test user is a recruiter too, 
            // but if they are 'candidate' role, they won't appear here unless we force it.
            // Let's assume testing sends BOTH if the user matches profile.
            // OR we just use the testEmail regardless of role for the purpose of the test.
            recruiterQuery = supabase.from('profiles').select('id, full_name, email, role, preferred_language').eq('email', testEmail);
        }

        const { data: recruiters } = await recruiterQuery;

        if (recruiters && recruiters.length > 0) {
            // Fetch recent candidates (Global "New Talent" for now)
            const { data: recentCandidates } = await supabase
                .from('profiles')
                .select('*')
                .in('role', ['candidate', 'CANDIDATE'])
                .order('created_at', { ascending: false })
                .limit(3);

            if (recentCandidates && recentCandidates.length > 0) {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tintel.se';

                for (const recruiter of recruiters) {
                    if (!recruiter.email) continue;

                    // Manual Locale
                    const userLocale = (recruiter.preferred_language === 'sv') ? 'sv' : 'en';
                    const dictionary = (userLocale === 'sv') ? sv : en;
                    const emailDict = dictionary.emails.talent_alert;

                    const subject = emailDict.subject.replace('{{count}}', String(recentCandidates.length));

                    try {
                        const htmlContent = getTalentAlertHtml({
                            recruiterName: recruiter.full_name || 'Recruiter',
                            candidates: recentCandidates.map(c => ({
                                role: c.job_title || 'New Candidate', // Fallback
                                experience: c.years_of_experience ? `${c.years_of_experience}y` : 'Experienced',
                                location: c.city || 'Sweden',
                                link: `${appUrl}/candidate/${c.username || c.id}` // direct link to profile
                            })),
                            texts: {
                                preview: emailDict.preview,
                                greeting: emailDict.greeting.replace('{{name}}', recruiter.full_name || 'Recruiter'),
                                intro: emailDict.intro,
                                button: emailDict.button,
                                footer_reason: emailDict.footer_reason,
                                unsubscribe: emailDict.unsubscribe
                            },
                            links: {
                                home: appUrl,
                                settings: `${appUrl}/dashboard/settings`
                            }
                        });

                        const { data, error } = await resend.emails.send({
                            from: 'Tintel <hello@tintel.se>',
                            to: recruiter.email,
                            subject: subject,
                            html: htmlContent
                        });

                        if (error) {
                            console.error(`[Cron] Recruiter Resend Error for ${recruiter.email}:`, error);
                            reports.push({ email: recruiter.email, type: 'recruiter_alert', status: 'failed', error: error.message });
                        } else {
                            reports.push({ email: recruiter.email, type: 'recruiter_alert', status: 'sent', id: data?.id });
                        }
                    } catch (err: any) {
                        console.error(`[Cron] Recruiter System Error for ${recruiter.email}:`, err);
                        reports.push({ email: recruiter.email, type: 'recruiter_alert', status: 'failed', error: err.message || String(err) });
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            reports
        });

    } catch (err: any) {
        console.error("[Cron] Critical Failure:", err);
        return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
    }
}
