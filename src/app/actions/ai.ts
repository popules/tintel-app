'use server'

import OpenAI from 'openai';

import { createClient } from "@/lib/supabase/server";

// Initialize OpenAI only if key exists to avoid crash on startup
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/**
 * HELPER: Verify Auth
 */
async function isAuthenticated() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
}

/**
 * GENERATE CANDIDATE BIO & SKILLS
 * Context: Candidate Onboarding
 */
export async function generateCandidateProfile(headline: string, experience: string) {
    console.log("Magic Fill: Start", { headline, experience });

    // if (!await isAuthenticated()) {
    //    console.log("Magic Fill: Unauthenticated (Bypassing for Debug)");
    //    // return { success: false, error: "Unauthorized" };
    // }

    if (!openai) {
        console.log("Magic Fill: No OpenAI Key");
        return {
            success: false,
            error: "OpenAI API Key not configured."
        };
    }

    try {
        console.log("Magic Fill: Calling OpenAI...");
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
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        console.log("Magic Fill: OpenAI Response", content);

        if (!content) throw new Error("No content generated");

        const result = JSON.parse(content);
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Magic Fill Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * GENERATE RECRUITER PITCH
 * Context: Job Card -> Pitch
 */
export async function generateRecruiterPitch(jobTitle: string, company: string, leadName: string, leadRole: string | null) {
    if (!await isAuthenticated()) return { success: false, error: "Unauthorized" };

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

/**
 * GENERATE VECTOR EMBEDDING
 * Context: Smart Search & Matchmaking
 */
export async function generateEmbedding(text: string) {
    if (!await isAuthenticated()) return { success: false, error: "Unauthorized" };

    if (!openai) {
        return { success: false, error: "OpenAI API Key not configured." };
    }

    try {
        // Sanitize text (remove newlines etc)
        const cleanText = text.replace(/\n/g, ' ');

        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: cleanText,
            encoding_format: "float",
        });

        const embedding = response.data[0].embedding;
        return { success: true, data: embedding };

    } catch (error: any) {
        console.error("Embedding Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * ANALYZE JOB TEXT (Hybrid Approach)
 * The client fetches the text (to avoid IP blocks) and sends it here for AI analysis.
 */
export async function analyzeJobText(text: string) {
    // Note: We might want allow public access for a "demo", but for now lock it down.
    if (!await isAuthenticated()) return { success: false, error: "Unauthorized" };

    if (!openai) return { success: false, error: "OpenAI API Key not configured." };

    try {
        const prompt = `
        Analyze this job ad text and extract the hiring manager or recruiter's details.
        Text Context: "${text.slice(0, 20000)}"

        If no direct email is found but a name is present, try to INFER email (First.Last@Company.com) ONLY if confident.

        Return JSON:
        {
            "name": "Name or 'Hiring Manager'",
            "email": "Email or null",
            "role": "Title or 'Recruiter'",
            "confidence": "High/Medium/Low"
        }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        return { success: true, data: JSON.parse(content || "{}") };

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * PARSE RESUME (PDF)
 * Context: Candidate Onboarding
 */
// @ts-ignore
import pdf from 'pdf-parse';

export async function parseResume(formData: FormData) {
    if (!await isAuthenticated()) return { success: false, error: "Unauthorized" };
    if (!openai) return { success: false, error: "OpenAI API Key not configured." };

    try {
        const file = formData.get("resume") as File;
        if (!file) return { success: false, error: "No file uploaded" };

        // Convert File to Buffer for pdf-parse
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract Text
        const data = await pdf(buffer);
        const rawText = data.text;

        // AI Analysis
        const prompt = `
        You are an expert Resume Parser. Extract the following information from this resume text.
        
        Resume Text:
        "${rawText.slice(0, 15000)}"

        Return strict JSON:
        {
            "headline": "Professional Headline (e.g. Senior Frontend Engineer)",
            "experience_years": "Number (integer) or 0 if unknown",
            "bio": "Professional summary/bio (max 400 chars)",
            "skills": "Comma separated string of top 10 technical/soft skills",
            "linkedin_url": "URL or null",
            "website": "URL or null",
            "location": "City, Country or null"
        }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        return { success: true, data: JSON.parse(content || "{}") };

    } catch (error: any) {
        console.error("Resume Parsing Error:", error);
    }
}

/**
 * GENERATE COMPANY SUMMARY
 * Context: Company Profile Page
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
