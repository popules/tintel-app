import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // Helper to find email in text
    const extractEmail = (text: string) => {
        if (!text) return null;
        const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
        return emailMatch ? emailMatch[1] : null;
    };

    try {
        // Strategy 1: Platsbanken ID detection
        const pbIdMatch = url.match(/platsbanken\/annonser\/(\d+)/) || url.match(/platsbanken\/annons\/(\d+)/);

        if (pbIdMatch) {
            const adId = pbIdMatch[1];
            let adData: any = null;
            let source = "Internal_API";

            // Attempt 1: Internal API (Best for Contacts)
            try {
                const apiRes = await fetch(`https://arbetsformedlingen.se/rest/pb/annons/${adId}`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)",
                        "Accept": "application/json"
                    }
                });
                if (apiRes.ok) {
                    adData = await apiRes.json();
                }
            } catch (e) { console.log("Internal API failed", e); }

            // Attempt 2: Public JobTech API (Reliable for Description)
            if (!adData) {
                try {
                    const publicRes = await fetch(`https://jobsearch.api.jobtechdev.se/search?q=${adId}`, {
                        headers: { "Accept": "application/json" }
                    });
                    if (publicRes.ok) {
                        const publicData = await publicRes.json();
                        if (publicData.hits && publicData.hits.length > 0) {
                            const hit = publicData.hits[0];
                            adData = {
                                // Map JobTech format to our expectation
                                beskrivning: { text: hit.description.text },
                                rubrik: hit.headline,
                                ansokan: hit.application_details,
                                arbetsplats: hit.workplace_address,
                                isPublic: true
                            };
                            source = "Public_API";
                        }
                    }
                } catch (e) { console.log("Public API failed", e); }
            }

            if (adData) {
                // Extract Data
                const description = adData.beskrivning?.text || adData.annonstext || "";

                // Try to find contact info
                let email = null;
                let name = null;
                let role = "Recruiter";

                if (adData.isPublic) {
                    // JobTech data structure
                    email = adData.ansokan?.email || extractEmail(description);
                    name = "Hiring Manager"; // Public API often hides names
                } else {
                    // Internal data structure
                    const contact = adData.arbetsplats?.kontaktpersoner?.[0];
                    email = adData.ansokan?.epostadress || contact?.epost || extractEmail(description);
                    name = contact?.namn || (contact?.fornamn ? `${contact.fornamn} ${contact.efternamn}` : null);
                    role = contact?.befattning || role;
                }

                return NextResponse.json({
                    email: email || null,
                    name: name || "Hiring Manager",
                    description: description || "Job description found.",
                    role: role,
                    source: source
                });
            }
        }

        // Fallback: Generic HTML Scrape (for non-PB URLs)
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
            }
        });

        if (!response.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });

        const html = await response.text();
        if (html.includes("Letar du efter ett nytt jobb?")) {
            return NextResponse.json({ error: "Protected Site" }, { status: 403 });
        }

        const email = extractEmail(html);
        const description = (html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || [])[1]?.replace(/<[^>]*>/g, ' ').slice(0, 1000) || "";

        return NextResponse.json({
            email: email,
            name: "Hiring Manager",
            description: description,
            role: "Recruiter",
            source: "HTML_Scrape"
        });

    } catch (error) {
        console.error("Scrape error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
