'use server'

import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function startOracleSession(jobId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // 1. Fetch Job Details
        const { data: job, error: jobError } = await supabase
            .from('job_posts')
            .select('*')
            .eq('id', jobId)
            .single();

        if (jobError || !job) throw new Error("Job not found");

        // 2. Fetch Intelligence (Hiring Velocity)
        const { data: signal } = await supabase
            .from('company_intelligence')
            .select('*')
            .eq('company_name', job.company)
            .single();

        // 3. Prepare Market Context Snapshot
        const marketSnapshot = {
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            salary_currency: job.salary_currency,
            hiring_velocity: signal?.hiring_velocity_score || 0,
            signal_label: signal?.signal_label || "Neutral",
            broad_category: job.broad_category,
            location: job.location
        };

        // 4. Create Session
        const { data: session, error: createError } = await supabase
            .from('oracle_sessions')
            .insert({
                candidate_id: user.id,
                job_id: jobId,
                market_context_snapshot: marketSnapshot,
                chat_history: []
            })
            .select()
            .single();

        if (createError) throw createError;

        return { success: true, sessionId: session.id };

    } catch (err: any) {
        console.error("Start Oracle Error:", err);
        return { success: false, error: err.message };
    }
}

export async function chatWithOracle(sessionId: string, userMessage: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    try {
        // 1. Fetch Session & Context
        const { data: session } = await supabase
            .from('oracle_sessions')
            .select('*, job_posts(*)')
            .eq('id', sessionId)
            .single();

        if (!session) throw new Error("Session not found");

        // 2. Append User Message to History
        const currentHistory = session.chat_history || [];
        const newHistory = [...currentHistory, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }];

        // 3. Construct System Prompt (The "Oracle" Persona)
        const job = session.job_posts;
        const ctx = session.market_context_snapshot;

        const systemPrompt = `
You are "The Oracle", a specialized AI Recruitment Consultant for Tintel.
Your goal is to screen the candidate for the role of ${job.title} at ${job.company}, BUT you are not just a screener.
You are a "Market-Aware Consultant". You use data to challenge and guide the candidate.

MARKET CONTEXT:
- Salary Range: ${ctx.salary_min || 'Unknown'} - ${ctx.salary_max || 'Unknown'} ${ctx.salary_currency || 'SEK'}
- Company Growth: ${ctx.signal_label} (Velocity: ${Math.round(ctx.hiring_velocity * 100)}%)
- Location: ${ctx.location}

INSTRUCTIONS:
1. Be professional, direct, and slightly "all-knowing". Not robotic, but insightful.
2. Ask 1-2 screening questions at a time.
3. USE THE DATA. If the user mentions a salary expectation, compare it to the MARKET CONTEXT. If they ask about the company, mention the Growth signal.
4. If the candidate is vague, press them for details ("The market requires specific React experience for this salary level. Can you elaborate?").
5. Keep responses concise (under 150 words).

Start by acknowledging their input and asking the next relevant question.
`;

        // 4. Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                ...newHistory.map((m: any) => ({ role: m.role, content: m.content }))
            ]
        });

        const aiResponse = completion.choices[0].message.content;

        // 5. Update History with AI Response
        const finalHistory = [...newHistory, { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }];

        await supabase
            .from('oracle_sessions')
            .update({ chat_history: finalHistory })
            .eq('id', sessionId);

        return { success: true, message: aiResponse };

    } catch (err: any) {
        console.error("Oracle Chat Error:", err);
        return { success: false, error: err.message };
    }
}
