import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    try {
        // --- STEP 1: FETCH CONTENT ---
        // (Same logic as before to get raw text)
        let rawText = "";
        let source = "HTML_Scrape";
        let isJobTech = false;

        // Try Platsbanken API first (cleanest data)
        const pbIdMatch = url.match(/platsbanken\/annonser\/(\d+)/) || url.match(/platsbanken\/annons\/(\d+)/);
        if (pbIdMatch) {
            const adId = pbIdMatch[1];
            try {
                const apiRes = await fetch(`https://arbetsformedlingen.se/rest/pb/annons/${adId}`, {
                    headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
                });
                if (apiRes.ok) {
                    const adData = await apiRes.json();
                    if (!adData.isPublic) {
                        // Found Internal Contact? Return immediately (Cheapest/Fastest)
                        const contact = adData.arbetsplats?.kontaktpersoner?.[0];
                        if (contact?.epost) {
                            return NextResponse.json({
                                email: contact.epost,
                                name: contact.namn || `${contact.fornamn} ${contact.efternamn}`,
                                role: contact.befattning || "Recruiter",
                                source: "Internal_API_Direct"
                            });
                        }
                    }
                    // If public or missing contact, treat as text
                    rawText = adData.beskrivning?.text || adData.annonstext || "";
                    source = "Internal_API_Text";
                    isJobTech = true;
                }
            } catch (e) { console.log("Internal API failed", e); }
        }

        // --- FALLBACK: JobTech Public API (Reliable for Text) ---
        if (!rawText && pbIdMatch) {
            const adId = pbIdMatch[1];
            try {
                const publicRes = await fetch(`https://jobsearch.api.jobtechdev.se/search?q=${adId}`, {
                    headers: { "Accept": "application/json" }
                });
                if (publicRes.ok) {
                    const publicData = await publicRes.json();
                    if (publicData.hits && publicData.hits.length > 0) {
                        const hit = publicData.hits[0];
                        // JobTech text is often reliable even if they hide structured contacts
                        rawText = hit.description?.text || "";
                        source = "Public_API_Text";
                    }
                }
            } catch (e) { console.log("Public API failed", e); }
        }

        // --- FALLBACK: Generic HTML Scrape ---
        if (!rawText) {
            const response = await fetch(url, {
                headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }
            });
            if (!response.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
            const html = await response.text();

            // Basic cleanup to remove scripts/styles
            rawText = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                .replace(/<[^>]+>/g, " ")
                .slice(0, 3000); // Limit context window
        }

        // --- STEP 2: AI EXTRACTION ---
        if (openai && rawText) {
            try {
                const prompt = `
                Analyze this job ad text and extract the hiring manager or recruiter's details.
                If no direct email is found but a name is present, try to INFER the email format if the company domain is obvious (e.g. "Anna Andersson at Spotify" -> "anna.andersson@spotify.com").
                
                Text Context:
                "${rawText.slice(0, 2000)}"

                Return JSON:
                {
                    "name": "Name or 'Hiring Manager'",
                    "email": "Email or null",
                    "role": "Job Title of contact person or 'Recruiter'",
                    "confidence": "High/Medium/Low"
                }
                `;

                const completion = await openai.chat.completions.create({
                    messages: [{ role: "user", content: prompt }],
                    model: "gpt-4o",
                    response_format: { type: "json_object" },
                });

                const aiData = JSON.parse(completion.choices[0].message.content || "{}");

                return NextResponse.json({
                    email: aiData.email,
                    name: aiData.name || "Hiring Manager",
                    role: aiData.role || "Recruiter",
                    source: `AI_Extracted (${source})`,
                    confidence: aiData.confidence
                });

            } catch (aiError) {
                console.error("AI Extraction Failed", aiError);
                // Fallthrough to regex
            }
        }

        // --- STEP 3: LEGACY FALLBACK (REGEX) ---
        const emailMatch = rawText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
        return NextResponse.json({
            email: emailMatch ? emailMatch[1] : null,
            name: "Hiring Manager",
            description: rawText.slice(0, 200),
            role: "Recruiter",
            source: "Legacy_Regex"
        });

    } catch (error) {
        console.error("Scrape error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
