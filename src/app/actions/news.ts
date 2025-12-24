"use server";

import Parser from 'rss-parser';

const parser = new Parser();

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

        // Query Google News
        // hl=sv (Language: Swedish), gl=SE (Location: Sweden), ceid=SE:sv
        const query = encodeURIComponent(`${cleanName}`);
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=sv&gl=SE&ceid=SE:sv`;

        console.log(`Fetching news for: ${cleanName} (${rssUrl})`);

        const feed = await parser.parseURL(rssUrl);

        const news = feed.items.slice(0, 5).map(item => ({
            title: item.title || "No Title",
            link: item.link || "#",
            pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString('sv-SE', {
                day: 'numeric', month: 'short'
            }) : "Recent",
            source: item.source || "Google News",
            snippet: item.contentSnippet || ""
        }));

        return { success: true, data: news };
    } catch (error: any) {
        console.error("News Fetch Error:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}
