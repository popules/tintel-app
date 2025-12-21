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

export default function CompanyPage() {
    const params = useParams();
    const router = useRouter();
    const companyName = decodeURIComponent(params.name as string);

    const [jobs, setJobs] = useState<any[]>([]);
    const [filterLocation, setFilterLocation] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    const handleMonitor = () => {
        // Mock functionality
        alert(`Now monitoring ${companyName}. You will receive alerts for new roles.`);
    };

    useEffect(() => {
        const fetchCompanyJobs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('job_posts')
                .select('*')
                .ilike('company', companyName)
                .order('created_at', { ascending: false });

            if (data) {
                setJobs(data);
            }
            setLoading(false);
        };

        if (companyName) fetchCompanyJobs();
    }, [companyName, supabase]);

    // Calculate Intelligence
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeJobs = jobs.filter(j => new Date(j.created_at) > thirtyDaysAgo);
    const historicalJobs = jobs.filter(j => new Date(j.created_at) <= thirtyDaysAgo);

    const locations = jobs.reduce((acc: any, job) => {
        const loc = job.location || "Unknown";
        acc[loc] = (acc[loc] || 0) + 1;
        return acc;
    }, {});
    const topLocations = Object.entries(locations).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);

    // Mock growth - random for now, but could be based on created_at vs last month
    const growth = Math.floor(Math.random() * 50) + 10;

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
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {topLocations[0]?.[0] || 'Sweden'}</span>
                                <span>•</span>
                                <span className={activeJobs.length > 0 ? "text-green-500 font-medium flex items-center gap-1" : "text-amber-500 font-medium flex items-center gap-1"}>
                                    <TrendingUp className="h-3 w-3" />
                                    {activeJobs.length > 0 ? "Currently Hiring" : "Monitoring History"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95" onClick={handleMonitor}>
                        Monitor Company
                    </Button>
                </div>

                {/* Intelligence Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-muted/30 border-0">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Leads</CardTitle>
                            <Briefcase className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{activeJobs.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">open positions right now</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-0">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Market History</CardTitle>
                            <TrendingUp className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{historicalJobs.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">past roles analyzed</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-0 md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Hiring Hotspots</CardTitle>
                            <MapPin className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent className="flex gap-4 flex-wrap">
                            {topLocations.map(([loc, count]: any) => (
                                <div
                                    key={loc}
                                    className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer transition-colors ${filterLocation === loc ? 'bg-indigo-100 border-indigo-500 text-indigo-900' : 'bg-background hover:bg-muted'}`}
                                    onClick={() => setFilterLocation(filterLocation === loc ? null : loc)}
                                >
                                    <span className="font-semibold">{loc}</span>
                                    <Badge variant={filterLocation === loc ? "default" : "secondary"}>{count}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Job List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Recruitment Pipeline</h2>
                        {filterLocation && (
                            <Button variant="ghost" size="sm" onClick={() => setFilterLocation(null)} className="text-muted-foreground h-auto p-0 hover:bg-transparent hover:text-foreground">
                                Clear filter ({filterLocation})
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
                                    const isActive = new Date(job.created_at) > thirtyDaysAgo;
                                    return (
                                        <div key={job.id} className="relative group">
                                            {!isActive && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <Badge variant="secondary" className="bg-muted text-muted-foreground border-0 opacity-80 backdrop-blur-sm">
                                                        Historical Ad
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
                            No active jobs found in {filterLocation || companyName}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
