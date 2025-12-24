'use server'

import OpenAI from 'openai';

// Initialize OpenAI only if key exists to avoid crash on startup
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/**
 * GENERATE CANDIDATE BIO & SKILLS
 * Context: Candidate Onboarding
 */
export async function generateCandidateProfile(headline: string, experience: string) {
    if (!openai) {
        // Fallback or Error if no key
        return {
            success: false,
            error: "OpenAI API Key not configured."
        };
    }

    try {
        const prompt = `
        You are an expert career coach. A candidate has the headline "${headline}" and ${experience} years of experience.
        
        1. Write a professional, punchy "About Me" bio (max 400 characters). 
           - Tone: Confident, professional, modern.
           - Focus: Expertise, drive, and value.
           
        2. List 8-10 relevant technical and soft skills for this role, comma separated.

        Return valid JSON in this format:
        {
            "bio": "string",
            "skills": "string"
        }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o", // or gpt-3.5-turbo if 4o unavailable
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const result = JSON.parse(content);
        return { success: true, data: result };

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * GENERATE RECRUITER PITCH
 * Context: Job Card -> Pitch
 */
export async function generateRecruiterPitch(jobTitle: string, company: string, leadName: string, leadRole: string | null) {
    if (!openai) {
        return { success: false, error: "OpenAI API Key not configured." };
    }

    try {
        const prompt = `
        You are a top-tier tech recruiter. 
        Target: ${leadName} (${leadRole || "Hiring Manager"}) at ${company}.
        Role: ${jobTitle}.

        Write a short, high-conversion sales pitch (email) offering a candidate.
        
        Rules:
        - Keep it under 100 words.
        - Be direct and high-value.
        - Don't be "salsey", be helpful.
        - Provide TWO variants:
          1. "Standard Professional" (Swedish)
          2. "Direct/Casual" (Swedish)

        Return valid JSON:
        {
            "pitch_formal": "string",
            "pitch_casual": "string"
        }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const result = JSON.parse(content);

        // Combine for the UI's existing format
        const combinedText = `👔 FORMELL (Svenska)\n${result.pitch_formal}\n\n==========================\n\n👋 CASUAL (Svenska)\n${result.pitch_casual}`;

        return { success: true, data: combinedText };

    } catch (error: any) {
        console.error("Pitch Generation Error:", error);
        return { success: false, error: error.message };
    }
}
