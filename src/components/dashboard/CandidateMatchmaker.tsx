"use client";

import { useEffect, useState } from "react";
import { getMatchingJobs } from "@/app/actions/matchmaker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Loader2, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { useTranslation } from "@/lib/i18n-context";

export function CandidateMatchmaker() {
    const { t } = useTranslation();
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadMatches() {
            try {
                const result = await getMatchingJobs(3, 0.4); // Top 3 matches
                if (result.success) {
                    setMatches(result.data || []);
                } else {
                    setError(result.error || t.dashboard.error);
                }
            } catch (err) {
                console.error(err);
                setError(t.dashboard.error);
            } finally {
                setLoading(false);
            }
        }
        loadMatches();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="h-28 w-full rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (error || matches.length === 0) {
        return null; // Don't show anything if no matches or error
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.matchmaker_title}</h2>
                        <p className="text-muted-foreground text-sm">{t.dashboard.matchmaker_desc}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Export Button (Pro) */}
                    <ExportButton candidates={matches} />

                    <Link href="/candidate/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                        {t.dashboard.view_more} <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matches.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="group relative overflow-hidden h-full hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                            {/* Score Gradient Border */}
                            <div className="absolute top-0 right-0 p-3">
                                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 shadow-lg">
                                    {(job.match_score * 100).toFixed(0)}{t.dashboard.match_score}
                                </Badge>
                            </div>

                            <CardHeader>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                                        <Briefcase className="h-3 w-3" />
                                        {job.broad_category || t.dashboard.opportunity}
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {job.title}
                                    </CardTitle>
                                    <CardDescription className="font-medium text-foreground/80">{job.company}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}, {job.county}
                                </div>

                                <Link
                                    href={`/candidate/jobs?id=${job.id}`}
                                    className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-100/50 hover:bg-indigo-600 hover:text-white transition-all group/btn"
                                >
                                    {t.dashboard.view_details}
                                    <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </CardContent>

                            {/* Subtle background glow */}
                            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full" />
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
