'use server'

import OpenAI from 'openai';

// Initialize OpenAI locally to ensure isolation
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/**
 * GENERATE COMPANY SUMMARY (Isolated)
 */
export async function generateCompanySummary(companyName: string) {
    if (!openai) return { success: false, error: "OpenAI API Key not configured." };

    try {
        const prompt = `
        Write a professional, concise (max 3 sentences) summary for the company "${companyName}".
        Focus on their primary industry, what they are known for, and their global or regional presence.
        Do not use marketing fluff. Keep it factual and "Wiki-style".
        If the company is Swedish, mention that.
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
        });

        const content = completion.choices[0].message.content;
        return { success: true, data: content };

    } catch (error: any) {
        console.error("Company Summary Error:", error);
        return { success: false, error: error.message };
    }
}
