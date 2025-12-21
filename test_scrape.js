// Native fetch in Node 18+

async function testScrape() {
    const adId = "30409821"; // Valid ID from user screenshot
    const url = `https://arbetsformedlingen.se/rest/pb/annons/${adId}`;

    console.log("Testing API Fetch to:", url);

    try {
        const apiRes = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://arbetsformedlingen.se/platsbanken/annonser/" + adId,
                "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
            }
        });

        if (apiRes.ok) {
            const data = await apiRes.json();
            console.log("API Success!");
            console.log("Contact:", data.arbetsplats?.kontaktpersoner);
            console.log("Email:", data.ansokan?.epostadress);
        } else {
            console.log("API Failed:", apiRes.status, apiRes.statusText);
            const text = await apiRes.text();
            console.log("Response:", text.substring(0, 500));
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testScrape();
