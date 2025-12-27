'use server'

import OpenAI from 'openai';
import { createClient } from "@/lib/supabase/server";
// @ts-ignore
import PDFParser from "pdf2json";

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
    if (!await isAuthenticated()) return { success: false, error: "Unauthorized" };

    if (!openai) {
        console.log("Resume Parse: No OpenAI Key");
        return { success: false, error: "OpenAI API Key not configured." };
    }

    try {
        const file = formData.get("resume") as File;
        if (!file) {
            console.log("Resume Parse: No file in callback");
            return { success: false, error: "No file uploaded" };
        }

        console.log("Resume Parse: File received", file.name, file.size);

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract Text using pdf2json
        console.log("Resume Parse: Parsing with pdf2json...");

        const rawText: string = await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(null, true); // true = raw text enabled

            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("pdf2json error:", errData.parserError);
                reject(errData.parserError);
            });

            pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                try {
                    // getRawTextContent() is the standard way to get text from pdf2json
                    const text = pdfParser.getRawTextContent();
                    resolve(text);
                } catch (e) {
                    // Fallback mechanism if method fails or version mismatch
                    console.log("Raw text extraction failed, trying simple approach");
                    resolve(JSON.stringify(pdfData));
                }
            });

            pdfParser.parseBuffer(buffer);
        });

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
            "skills": [ "Array", "of", "strings" ],
            "linkedin_url": "URL or null",
            "website": "URL or null",
            "location": "City, Country or null",
            "work_experience": [
                { 
                    "company": "Company Name", 
                    "role": "Title", 
                    "start_date": "YYYY-MM or YYYY", 
                    "end_date": "YYYY-MM or YYYY or Present", 
                    "description": "Short bullet points (max 200 chars)"
                }
            ],
            "education": [
                {
                    "school": "School Name",
                    "degree": "Degree / Field of Study",
                    "start_date": "YYYY",
                    "end_date": "YYYY"
                }
            ]
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
