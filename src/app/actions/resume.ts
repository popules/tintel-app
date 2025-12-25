'use server'

import OpenAI from 'openai';
import { createClient } from "@/lib/supabase/server";

// Initialize OpenAI
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

export async function parseResume(formData: FormData) {
    console.log("Resume Parse: Start");

    // Auth Check
    // if (!await isAuthenticated()) return { success: false, error: "Unauthorized" };

    if (!openai) {
        console.log("Resume Parse: No OpenAI Key");
        return { success: false, error: "OpenAI API Key not configured." };
    }

    try {
        // 1. POLYFILLS (Must run before pdf-parse import)
        if (typeof Promise.withResolvers === 'undefined') {
            // @ts-ignore
            Promise.withResolvers = function () {
                let resolve, reject;
                const promise = new Promise((res, rej) => {
                    resolve = res;
                    reject = rej;
                });
                return { promise, resolve, reject };
            };
        }

        if (typeof global.DOMMatrix === 'undefined') {
            // @ts-ignore
            global.DOMMatrix = class DOMMatrix {
                constructor() {
                    this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
                }
                setMatrixValue(str: any) { return this; }
                translate(x: any, y: any) { return this; }
                scale(x: any, y: any) { return this; }
                rotate(angle: any) { return this; }
                multiply(m: any) { return this; }
                toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
            }
        }

        // 2. DYNAMIC IMPORT (This prevents hoisting)
        console.log("Resume Parse: Importing pdf-parse dynamically...");
        // @ts-ignore
        const pdfModule = await import('pdf-parse');
        const pdf = pdfModule.default || pdfModule;

        const file = formData.get("resume") as File;
        if (!file) {
            console.log("Resume Parse: No file in callback");
            return { success: false, error: "No file uploaded" };
        }

        console.log("Resume Parse: File received", file.name, file.size);

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract Text
        console.log("Resume Parse: Parsing PDF text...");
        const data = await pdf(buffer);
        const rawText = data.text;
        console.log("Resume Parse: Text extracted, length:", rawText.length);

        // AI Analysis
        console.log("Resume Parse: Calling OpenAI...");
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
        console.log("Resume Parse: OpenAI Response", content);

        return { success: true, data: JSON.parse(content || "{}") };

    } catch (error: any) {
        console.error("Resume Parsing Error:", error);
        return { success: false, error: error.message };
    }
}
