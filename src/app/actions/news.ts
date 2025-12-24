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

        // Query: "Company Sverige"
        const query = `${cleanName} Sverige`;

        console.log("Fetching news for: " + query);

        // Google News RSS URL
        // hl=sv (Language: Swedish), gl=SE (Location: Sweden), ceid=SE:sv
        const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=sv&gl=SE&ceid=SE:sv`;

        console.log(`Fetching news from URL: ${feedUrl}`);

        const feed = await parser.parseURL(feedUrl);

        const news = feed.items.slice(0, 5).map(item => ({
            title: item.title || "No Title",
            link: item.link || "#",
            pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Recent",
            source: item.source || "Google News"
        }));

        return { success: true, data: news };
    } catch (error: any) {
        console.error("News Fetch Error:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}
