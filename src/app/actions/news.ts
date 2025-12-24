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
        const cleanName = companyName
            .replace(/\s(AB|Sweden|Group|Nordic|Global|Sverige)\b/gi, '')
            .replace(/[^\w\s\å\ä\ö]/gi, '')
            .trim();

        const query = `${cleanName} Sverige`;
        console.log("Fetching news for: " + query);

        // Use Google News RSS URL
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=sv&gl=SE&ceid=SE:sv`;

        // Use rss2json to proxy the converting of RSS to JSON (Bypasses local IP blocks mostly)
        // Note: Free tier has limits, but good for demo.
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        console.log(`Fetching via Proxy: ${proxyUrl}`);

        const res = await fetch(proxyUrl);
        const data = await res.json();

        if (data.status !== 'ok') {
            throw new Error(`Proxy Error: ${data.message}`);
        }

        const news = data.items.slice(0, 5).map((item: any) => ({
            title: item.title || "No Title",
            link: item.link || "#",
            pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Recent",
            source: "Google News" // rss2json simplifies source sometimes
        }));

        return { success: true, data: news };

    } catch (error: any) {
        console.error("News Fetch Error:", error);
        return { success: false, error: "Failed to fetch news" };
    }
}
