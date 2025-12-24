"use server";

import Parser from 'rss-parser';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
});

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    snippet?: string;
}

export async function fetchCompanyNews(companyName: string): Promise<{ success: boolean; data?: NewsItem[]; error?: string }> {
    if (!companyName) return { success: false, error: "Company name required" };

    try {
        // Clean company name for better search results
        // Remove "AB", "Sweden", "Group", etc.
        const cleanName = companyName
            .replace(/\s(AB|Sweden|Group|Nordic|Global|Sverige)\b/gi, '')
            .replace(/[^\w\s\å\ä\ö]/gi, '') // Remove special chars
            .trim();

        // Improve query: "Company Sverige"
        const query = `${cleanName} Sverige`;

        console.log("Fetching news for: " + query);

        // Switch to Bing News (Often more permissive for server-side defaults)
        // Format: https://www.bing.com/news/search?q=SAAB+Sverige&format=rss
        const feedUrl = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss`;

        console.log(`Fetching news from URL: ${feedUrl}`);

        const feed = await parser.parseURL(feedUrl);

        const news = feed.items.slice(0, 5).map(item => ({
            title: item.title || "No Title",
            link: item.link || "#",
            // Bing dates are usually good
            pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Recent",
            source: item.source || "Bing News" // Bing doesn't always give source name clearly in standard RSS fields
        }));

        return { success: true, data: news };
    } catch (error: any) {
        console.error("News Fetch Error:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}
