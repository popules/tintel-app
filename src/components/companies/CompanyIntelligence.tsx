"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Newspaper, Zap, Code2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

interface CompanyIntelligenceProps {
    companyName: string;
    jobs: any[];
}

export function CompanyIntelligence({ companyName, jobs }: CompanyIntelligenceProps) {

    // 1. Simulate Hiring Velocity (Mock Data based on job count volume)
    // In a real app, we'd aggregate `created_at` over time.
    const velocityData = [
        { month: 'Jan', jobs: Math.floor(jobs.length * 0.2) + 2 },
        { month: 'Feb', jobs: Math.floor(jobs.length * 0.3) + 1 },
        { month: 'Mar', jobs: Math.floor(jobs.length * 0.4) + 3 },
        { month: 'Apr', jobs: Math.floor(jobs.length * 0.6) + 4 },
        { month: 'May', jobs: Math.floor(jobs.length * 0.8) + 2 },
        { month: 'Jun', jobs: jobs.length } // Current
    ];

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

    // 3. Mock News (Realistic placeholders)
    const news = [
        {
            date: "2 days ago",
            source: "Business Insider",
            title: `${companyName} announces expansion in Nordic region`,
            sentiment: "positive"
        },
        {
            date: "1 week ago",
            source: "TechCrunch",
            title: `Market analysis: ${companyName}'s growth trajectory in 2025`,
            sentiment: "neutral"
        },
        {
            date: "2 weeks ago",
            source: "Dagens Industri",
            title: "New strategic partnership aimed at AI innovation",
            sentiment: "positive"
        }
    ];

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
                        <p className="text-xs text-muted-foreground">Job posting volume over last 6 months</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">
                        +24% Growth
                    </Badge>
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
                                itemStyle={{ color: '#fff' }}
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

                {/* Tech Stack */}
                <Card className="bg-[#0f111a] border-white/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-indigo-500" />
                            Inferred Tech Stack
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {techStack.map(tech => (
                            <Badge key={tech} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                                {tech}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>

                {/* News Feed */}
                <Card className="bg-[#0f111a] border-white/5 flex-1">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-blue-500" />
                            Recent Signals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[180px] pr-4">
                            <div className="space-y-4">
                                {news.map((item, i) => (
                                    <div key={i} className="flex gap-3 group cursor-pointer">
                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.sentiment === 'positive' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                        <div>
                                            <h4 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground">
                                                <span>{item.source}</span>
                                                <span>•</span>
                                                <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
