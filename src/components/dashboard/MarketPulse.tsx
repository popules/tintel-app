"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";
import { getMarketIntelligence } from "@/app/actions/intelligence";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketPulse() {
    const [data, setData] = useState<{ growing: any[], slowing: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMarketIntelligence();
            if (res.success && res.data) {
                setData(res.data);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
        </div>;
    }

    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in duration-500">
            {/* Aggressive Hirers */}
            <Card className="bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-200/50 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                        <TrendingUp className="h-5 w-5" />
                        Aggressive Growth Signals
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Companies increasing hiring velocity &gt; 20%</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.growing.length > 0 ? (
                            data.growing.map((company, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-300">
                                            {company.company_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {company.company_name}
                                        </span>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                                        +{(company.hiring_velocity_score * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground py-4 text-center italic opacity-70">
                                No aggressive growth signals detected this week.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Poaching Targets (Leakers) */}
            <Card className="bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-950/20 dark:to-background border-amber-200/50 dark:border-amber-800/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-700 dark:text-amber-500">
                            <Activity className="h-5 w-5" />
                            Poaching Opportunities
                        </CardTitle>
                        <Badge variant="outline" className="border-amber-200 text-amber-600 text-[10px] uppercase tracking-wider">
                            High Churn Risk
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Companies with growing job deficit (Potential Leakers)</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.slowing.length > 0 ? (
                            data.slowing.map((company, i) => (
                                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 p-2 rounded transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center font-bold text-xs text-amber-600 dark:text-amber-400">
                                            {company.company_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-sm text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {company.company_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-3 w-3 text-amber-500" />
                                        <span className="text-xs font-mono text-muted-foreground">
                                            {(company.hiring_velocity_score * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground py-4 text-center italic opacity-70">
                                Market is stable. No major churn signals.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
