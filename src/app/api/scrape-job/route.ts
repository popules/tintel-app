import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    try {
        // Special handling for Platsbanken (using their internal API if possible)
        const pbIdMatch = url.match(/platsbanken\/annonser\/(\d+)/);
        if (pbIdMatch) {
            const adId = pbIdMatch[1];
            try {
                // Mimic a real browser request to avoid 403/Blocking
                const apiRes = await fetch(`https://arbetsformedlingen.se/rest/pb/annons/${adId}`, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "application/json, text/plain, */*",
                        "Referer": "https://arbetsformedlingen.se/platsbanken/annonser/" + adId,
                        "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
                    }
                });

                if (apiRes.ok) {
                    const adData = await apiRes.json();

                    // Extract rich data from JSON
                    const applicationContact = adData.ansokan?.epostadress;
                    const contactPerson = adData.arbetsplats?.kontaktpersoner?.[0]; // Array of contacts

                    const email = applicationContact || contactPerson?.epost || null;
                    const name = contactPerson?.namn || (contactPerson?.fornamn ? `${contactPerson.fornamn} ${contactPerson.efternamn}` : null);
                    // Prioritize annonstext which is usually HTML
                    const description = adData.annonstext || adData.beskrivning?.text;

                    if (email || description) {
                        return NextResponse.json({
                            email: email || null,
                            name: name || "Hiring Manager",
                            description: description || "Job description data found via API.",
                            role: contactPerson?.befattning || "Recruiter",
                            source: "API"
                        });
                    }
                }
            } catch (e) {
                console.log("PB API failed, falling back to HTML", e);
            }
        }

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Referer": "https://www.google.com/"
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch page" }, { status: response.status });
        }

        const html = await response.text();

        // Detect "Generic Start Page" trap
        if (html.includes("Letar du efter ett nytt jobb? I Platsbanken hittar du")) {
            return NextResponse.json({
                error: "Access Denied: Scraper blocked or redirected to homepage.",
                description: "Cannot view this ad due to site protection. Please click 'Open Original'."
            }, { status: 403 });
        }

        // 1. Extract Email (mailto:)
        // Regex looks for mailto: followed by email
        const emailMatch = html.match(/mailto:([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
        const email = emailMatch ? emailMatch[1] : null;

        // 2. Extract Name
        // This is tricky without DOM, but often name is within 100-200 chars before the email or "Kontakt" header.
        // Or sometimes logic: "Kontakt: Firstname Lastname"
        // Let's try to find text appearing before the email if we found one.
        let name = null;
        if (email) {
            // Try to find the name in the text preceding the email link code
            // e.g. "Bhavana Repal<br><a href='mailto:..."
            // We search for capitalized words before the email occurrence in HTML
            const emailIndex = html.indexOf(email);
            const context = html.substring(Math.max(0, emailIndex - 300), emailIndex);

            // Look for generic name patterns (2 capitalized words) not inside tags tags
            // This is very loose but better than nothing
            const nameMatch = context.match(/>\s*([A-Z][a-z]+ [A-Z][a-z]+)\s*</) || context.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
            // Refined: Platsbanken often behaves like: <div class="...">Name Lastname</div> ... <a href="mailto:...">
            if (nameMatch) {
                name = nameMatch[1];
            }
        }

        // 3. Extract Description
        // Specific checks for common meta tags or container classes
        let description = "";
        // Platsbanken JS fallback (if API failed): usually in a scripted variable or meta
        const descMatch = html.match(/<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

        if (descMatch) {
            description = descMatch[1].replace(/<[^>]*>/g, ' ').slice(0, 1000) + "...";
        } else {
            // Fallback: Title meta tag description?
            const metaDesc = html.match(/<meta name="description" content="([^"]*)"/i);
            if (metaDesc) description = metaDesc[1];
        }

        return NextResponse.json({
            email: email || null,
            name: name || "Hiring Manager",
            description: description || "Could not extract description. Please view original ad.",
            role: "Recruiter / Manager", // hardcoded assumption
            scraped: true
        });

    } catch (error) {
        console.error("Scrape error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
