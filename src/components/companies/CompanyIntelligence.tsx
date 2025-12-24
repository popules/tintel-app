"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Newspaper, Zap, Code2, HelpCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

interface CompanyIntelligenceProps {
    companyName: string;
    jobs: any[];
}

export function CompanyIntelligence({ companyName, jobs }: CompanyIntelligenceProps) {

    // 1. Calculate Real Hiring Velocity
    // Group jobs by Month-Year
    const jobDates = jobs.map(j => new Date(j.publishedAt || j.created_at));
    // Sort oldest to newest
    jobDates.sort((a, b) => a.getTime() - b.getTime());

    // If no jobs, empty array
    const velocityData: any[] = [];

    if (jobDates.length > 0) {
        const monthCounts = new Map<string, number>();

        // Get range from first job to now
        const start = jobDates[0];
        const end = new Date();
        const current = new Date(start);
        current.setDate(1); // Start of that month

        while (current <= end) {
            const key = current.toLocaleDateString('en-US', { month: 'short' }); // e.g., "Oct"
            monthCounts.set(key, 0);
            current.setMonth(current.getMonth() + 1);
        }

        // Fill counts
        jobDates.forEach(date => {
            const key = date.toLocaleDateString('en-US', { month: 'short' });
            if (monthCounts.has(key)) {
                monthCounts.set(key, (monthCounts.get(key) || 0) + 1);
            }
        });

        // Convert to array
        monthCounts.forEach((count, month) => {
            velocityData.push({ month, jobs: count });
        });
    }

    // 2. Infer Tech Stack from Job Titles (Simple Heuristics)
    const stack = new Set<string>();
    const titles = jobs.map(j => j.title.toLowerCase());
    if (titles.some(t => t.includes('front') || t.includes('react') || t.includes('web'))) {
        stack.add('React'); stack.add('TypeScript'); stack.add('Tailwind');
    }
    if (titles.some(t => t.includes('back') || t.includes('node') || t.includes('java'))) {
        stack.add('Node.js'); stack.add('PostgreSQL'); stack.add('AWS');
    }
    if (titles.some(t => t.includes('data') || t.includes('python'))) {
        stack.add('Python'); stack.add('Pandas'); stack.add('Snowflake');
    }
    if (titles.some(t => t.includes('net') || t.includes('c#'))) {
        stack.add('.NET Core'); stack.add('Azure'); stack.add('C#');
    }
    // Fallback if generic
    if (stack.size === 0) {
        stack.add('Modern Tech Stack'); stack.add('Cloud Infrastructure');
    }
    const techStack = Array.from(stack);

    // 3. Real Swedish News (Google RSS)
    const [news, setNews] = useState<any[]>([]);
    const [loadingNews, setLoadingNews] = useState(true);

    useEffect(() => {
        let mounted = true;
        const loadNews = async () => {
            try {
                // Dynamically import to avoid server/client boundary issues if any
                const { fetchCompanyNews } = await import("@/app/actions/news");
                const res = await fetchCompanyNews(companyName);
                if (mounted && res.success && res.data) {
                    setNews(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoadingNews(false);
            }
        };
        loadNews();
        return () => { mounted = false; };
    }, [companyName]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Hiring Velocity Chart */}
            <Card className="lg:col-span-2 bg-[#0f111a] border-white/5 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Hiring Velocity
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Job posting volume over time</p>
                    </div>
                    {/* Badge removed for now as growth calculation needs to be real */}
                </CardHeader>
                <CardContent className="h-[250px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={velocityData}>
                            <defs>
                                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="month"
                                stroke="#525252"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#525252"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1d2d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="jobs"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorJobs)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Right Column: Tech Stack & News */}
            <div className="space-y-6">

                {/* News Feed */}
                <Card className="bg-[#0f111a] border-white/5 flex-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-blue-500" />
                            Latest News (Sweden)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[180px] pr-4">
                            <div className="space-y-4">
                                {loadingNews ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-3 animate-pulse">
                                                <div className="h-2 w-2 rounded-full bg-white/10 shrink-0 mt-1" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-3 bg-white/10 rounded w-3/4" />
                                                    <div className="h-2 bg-white/5 rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : news.length > 0 ? (
                                    news.map((item, i) => (
                                        <a
                                            key={i}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded -mx-2 transition-colors"
                                        >
                                            <div className="mt-1 h-2 w-2 rounded-full shrink-0 bg-blue-500 group-hover:bg-indigo-400 transition-colors" />
                                            <div>
                                                <h4 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                                                    {item.title}
                                                </h4>
                                                <div className="flex gap-2 mt-1.5 text-[10px] text-muted-foreground">
                                                    <span>{item.source || "Google News"}</span>
                                                    <span>•</span>
                                                    <span>{item.pubDate}</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No recent news found.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
