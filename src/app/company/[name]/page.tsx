"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { JobCard } from "@/components/dashboard/JobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Users, TrendingUp, Briefcase } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CompanyIntelligence } from "@/components/companies/CompanyIntelligence";
import { generateCompanySummary } from "@/app/actions/company-summary";
import { checkMonitorStatus, toggleMonitorCompany } from "@/app/actions/companies";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n-context";

export default function CompanyPage() {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslation();
    const txt = t.company_page;
    const companyName = decodeURIComponent(params.name as string);

    const [jobs, setJobs] = useState<any[]>([]);
    const [filterLocation, setFilterLocation] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMonitored, setIsMonitored] = useState(false);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const supabase = createClient();

    const handleMonitor = async () => {
        setIsMonitoring(true);
        try {
            const res = await toggleMonitorCompany(companyName);
            if (res.success) {
                setIsMonitored(res.monitored || false);
                toast.success(res.monitored ? txt.monitoring : txt.monitor_button + " Stopped");
            } else {
                toast.error(res.error || "Failed to monitor");
            }
        } catch (err) {
            console.error("Failed to monitor", err);
            toast.error("Something went wrong");
        } finally {
            setIsMonitoring(false);
        }
    };

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .ilike('company', `%${companyName}%`)
                .order('created_at', { ascending: false });

            if (data) {
                setJobs(data);
            }
            setLoading(false);
        };

        const checkStatus = async () => {
            if (companyName) {
                const isMonitored = await checkMonitorStatus(companyName);
                setIsMonitored(isMonitored);
            }
        };

        if (companyName) {
            fetchCompanyJobs();
            checkStatus();
        }
    }, [companyName, supabase]);

    // Calculate Intelligence
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const activeJobs = jobs.filter(j => {
        const dateStr = j.publishedAt || j.created_at;
        return dateStr && dateStr > thirtyDaysAgo;
    });
    const historicalJobs = jobs.filter(j => {
        const dateStr = j.publishedAt || j.created_at;
        return dateStr && dateStr <= thirtyDaysAgo;
    });

    const locations = jobs.reduce((acc: any, job) => {
        const loc = job.location || "Unknown";
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
    }, {});
    const topLocations = Object.entries(locations).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);

    // Calculate Category Distribution (Recruitment DNA)
    const categoryCounts = jobs.reduce((acc: any, job) => {
        const cat = job.broad_category || "Other";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const dna = Object.entries(categoryCounts)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 4)
        .map(([name, count]: [string, any]) => ({
            name,
            percentage: Math.round((count / jobs.length) * 100)
        }));

    // 4. AI Company Summary
    const [summary, setSummary] = useState<string | null>(null);
    const [summaryError, setSummaryError] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchSummary = async () => {
            try {
                const res = await generateCompanySummary(companyName);

                if (mounted) {
                    if (res.success && res.data) {
                        setSummary(res.data);
                    } else {
                        console.error("AI Summary Failed:", res.error);
                        setSummaryError(res.error || "Unknown error");
                    }
                }
            } catch (err: any) {
                console.error("Verification Error:", err);
                if (mounted) setSummaryError(err.message || "Fetch failed completely");
            } finally {
                if (mounted) setLoadingSummary(false);
            }
        };
        fetchSummary();
        return () => { mounted = false; };
    }, [companyName]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="flex-1 container mx-auto p-4 md:p-8 space-y-8">
                {/* Company Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Building2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">{companyName}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <span className={activeJobs.length > 0 ? "text-green-500 font-medium flex items-center gap-1" : "text-amber-500 font-medium flex items-center gap-1"}>
                                    <TrendingUp className="h-3 w-3" />
                                    {activeJobs.length > 0 ? txt.currently_hiring : txt.monitoring_history}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        variant={isMonitored ? "outline" : "default"}
                        className={isMonitored ? "border-indigo-500/50 text-indigo-500" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"}
                        onClick={handleMonitor}
                        disabled={isMonitoring || isMonitored}
                    >
                        {isMonitoring ? txt.syncing : (isMonitored ? txt.monitoring : txt.monitor_button)}
                    </Button>
                </div>

                {/* Intelligence Dashboard (News & Hiring Velocity) */}
                <CompanyIntelligence companyName={companyName} jobs={jobs} />

                {/* Intelligence Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-1">
                        <Card className="bg-muted/30 border-0">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-indigo-500" />
                                    {txt.active_leads}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{activeJobs.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">{txt.open_positions}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-muted/30 border-0">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                    {txt.market_history}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{historicalJobs.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">{txt.past_roles}</p>
                            </CardContent>
                        </Card>

                        {/* Company Summary (New) */}
                        <Card className="bg-muted/30 border-0 md:col-span-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    {txt.about} {companyName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {loadingSummary ? (
                                        <div className="space-y-2 animate-pulse">
                                            <div className="h-4 bg-white/10 rounded w-full" />
                                            <div className="h-4 bg-white/10 rounded w-5/6" />
                                            <div className="h-4 bg-white/10 rounded w-4/6" />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {summary || (
                                                <span className="text-amber-500/80">
                                                    {companyName} {txt.insufficient_data.replace('DNA mapping', '')} {/* Fallback text somewhat broken, reusing data */}
                                                    is a leading organization in its field.
                                                    <br />
                                                    <span className="text-xs font-mono mt-2 block p-2 bg-amber-500/10 rounded border border-amber-500/20">
                                                        Debug: {summaryError || "AI Summary unavailable"}
                                                    </span>
                                                </span>
                                            )}
                                        </p>
                                    )}

                                    {/* Decorative Quote */}
                                    <div className="absolute -top-1 -left-2 text-4xl text-indigo-500/10 font-serif">“</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recruitment DNA (Big Graph-like Card) */}
                    <Card className="lg:col-span-2 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/10 shadow-xl shadow-indigo-500/5 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Users className="h-5 w-5 text-indigo-500" />
                                {txt.recruitment_dna}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">{txt.hiring_focus} {jobs.length} roles</p>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {dna.map((item: any) => (
                                <div key={item.name} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="truncate max-w-[200px]">{item.name}</span>
                                        <span>{item.percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                            {dna.length === 0 && <p className="text-sm text-muted-foreground italic">{txt.insufficient_data}</p>}
                        </CardContent>
                    </Card>
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">{txt.pipeline_title}</h2>
                        {filterLocation && (
                            <Button variant="ghost" size="sm" onClick={() => setFilterLocation(null)} className="text-muted-foreground h-auto p-0 hover:bg-transparent hover:text-foreground">
                                {txt.clear_filter} ({filterLocation})
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[300px] rounded-xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs
                                .filter(job => filterLocation ? job.location === filterLocation : true)
                                .map((job, i) => {
                                    const dateStr = job.publishedAt || job.created_at;
                                    const isActive = dateStr && dateStr > thirtyDaysAgo;
                                    return (
                                        <div key={job.id} className="relative group">
                                            {!isActive && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 opacity-80 backdrop-blur-sm">
                                                        {txt.historical_ad}
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className={!isActive ? "opacity-75 grayscale-[0.5] transition-all group-hover:grayscale-0 group-hover:opacity-100" : ""}>
                                                <JobCard job={job} index={i} />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    {!loading && jobs.filter(job => filterLocation ? job.location === filterLocation : true).length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            {txt.no_active_jobs} {filterLocation || companyName}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
