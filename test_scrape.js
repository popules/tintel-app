// Native fetch in Node 18+

async function testScrape() {
    const adId = "30409821";

    // 1. Try HTML Fetch
    const htmlUrl = `https://arbetsformedlingen.se/platsbanken/annonser/${adId}`;
    console.log("Testing HTML Fetch to:", htmlUrl);
    try {
        const res = await fetch(htmlUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        const text = await res.text();
        console.log("HTML Status:", res.status);
        const title = text.match(/<title>(.*?)<\/title>/)?.[1];
        console.log("HTML Title:", title);

        if (text.includes("Letar du efter ett nytt jobb?") || title?.includes("Platsbanken")) {
            console.log("Detected Generic Start Page (Client-Side Rendered)");
        } else {
            console.log("Received Content snippet:", text.substring(0, 200));
        }
    } catch (e) { console.error("HTML fetch failed", e); }

    // 2. Try JobTech Public API
    const jobTechUrl = `https://jobsearch.api.jobtechdev.se/search?q=${adId}`;
    console.log("\nTesting JobTech API:", jobTechUrl);
    try {
        const res = await fetch(jobTechUrl, {
            headers: {
                "Accept": "application/json"
            }
        });
        console.log("API Status:", res.status);
        if (res.ok) {
            const data = await res.json();
            console.log("Hits:", data.total.value);
            if (data.hits && data.hits.length > 0) {
                const ad = data.hits[0];
                console.log("Found Ad:", ad.headline);
                console.log("Description snippet:", ad.description.text.substring(0, 100));
                console.log("Email:", ad.application_details?.email);
                console.log("Contact:", ad.workplace_address?.city); // JobTech doesn't always have person contact
            }
        }
    } catch (e) { console.log(e); }
}

testScrape();
