"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

    return (
        <div className="w-full">
            {/* Hiring Velocity Chart */}
            <Card className="bg-[#0f111a] border-white/5 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Hiring Velocity
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">Job posting volume over time</p>
                    </div>
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
        </div>
    );
}
