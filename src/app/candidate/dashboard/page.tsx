"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Loader2, User, MapPin, Briefcase, Edit, Eye, TrendingUp, Sparkles, Search, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CandidateCard } from "@/components/dashboard/CandidateCard";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";
import { CandidateMatchmaker } from "@/components/dashboard/CandidateMatchmaker";
import { UpgradeModal } from "@/components/payment/UpgradeModal";
import { LogOut } from "lucide-react";

export default function CandidateDashboardPage() {
    const { t } = useTranslation();
    const txt = t.candidate_dashboard;

    const [candidate, setCandidate] = useState<any>(null);
    const [recentApps, setRecentApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [credits, setCredits] = useState(0);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/candidate/login");
                return;
            }

            // Security Check
            if (user.user_metadata?.role !== 'candidate') {
                router.push("/dashboard");
                return;
            }

            // Fetch Profile
            const { data: profile } = await supabase
                .from("candidates")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setCandidate(profile);
                setIsOpen(profile.is_open);
                setCredits(profile.oracle_credits || 0);
            } else {
                router.push("/candidate/onboarding");
                return;
            }

            // Fetch Recent Activity (Pipeline)
            const { data: apps } = await supabase
                .from("applications")
                .select("*")
                .eq("candidate_id", user.id)
                .order("updated_at", { ascending: false })
                .limit(3);

            if (apps) setRecentApps(apps);

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleStatusToggle = async (checked: boolean) => {
        setUpdatingStatus(true);
        setIsOpen(checked);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("candidates")
            .update({ is_open: checked })
            .eq("id", user.id);

        if (error) {
            console.error("Error updating status:", error);
            setIsOpen(!checked);
        } else {
            setCandidate({ ...candidate, is_open: checked });
        }
        setUpdatingStatus(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just go to jobs page. Ideally, pass query param.
        // We'll fix JobMarketplace to read ?q= later.
        router.push(`/candidate/jobs?q=${encodeURIComponent(searchTerm)}`);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!candidate) return null;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* 1. Hero / Search Section */}
            <div className="relative overflow-hidden bg-slate-950 px-6 py-16 md:py-24 lg:px-8 border-b border-white/5">
                <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUpgrade(true)}
                        className="bg-white/5 hover:bg-white/10 border-white/10 text-white backdrop-blur-md"
                    >
                        <Sparkles className="h-3.5 w-3.5 mr-2 text-indigo-400" />
                        {credits} {(t as any).oracle?.credits || "Credits"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
                        className="text-white/50 hover:text-white hover:bg-white/10"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="mx-auto max-w-2xl text-center relative z-10">
                    <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-6">
                        {txt.hero_title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{txt.hero_highlight}</span>
                    </h1>
                    <p className="text-lg leading-8 text-gray-400 mb-8">
                        {txt.hero_subtitle}
                    </p>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={txt.search_placeholder}
                                className="pl-10 h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/20 transition-all rounded-xl w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" size="lg" className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex-1 sm:flex-none">
                                {txt.search_button}
                            </Button>
                            <Button type="button" size="lg" variant="outline" className="h-12 px-6 border-white/10 hover:bg-white/5 text-white rounded-xl flex-1 sm:flex-none" asChild>
                                <Link href="/candidate/jobs">
                                    Visa Alla Jobb
                                </Link>
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
                        <span>{txt.popular}</span>
                        <Link href="/candidate/jobs?q=Project+Manager" className="hover:text-indigo-400 transition-colors">Project Manager</Link>
                        <Link href="/candidate/jobs?q=Developer" className="hover:text-indigo-400 transition-colors">Developer</Link>
                        <Link href="/candidate/jobs?q=Sales" className="hover:text-indigo-400 transition-colors">Sales</Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-16">

                {/* Matchmaker Section */}
                <CandidateMatchmaker />

                {/* 2. My Pipeline Snapshot */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">{txt.recent_activity}</h2>
                        <Button variant="ghost" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
                            <Link href="/candidate/my-jobs">
                                {txt.go_to_pipeline} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {recentApps.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentApps.map((app) => (
                                <Link href="/candidate/my-jobs" key={app.id}>
                                    <Card className="h-full hover:border-indigo-500/30 hover:shadow-lg transition-all cursor-pointer group">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary" className={`uppercase text-[10px] font-bold tracking-wider mb-2
                                                    ${app.status === 'saved' ? 'bg-zinc-100 text-zinc-600' :
                                                        app.status === 'applied' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}
                                                `}>
                                                    {app.status}
                                                </Badge>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                            <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">{app.job_title}</CardTitle>
                                            <CardDescription className="line-clamp-1">{app.company_name}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="text-xs text-muted-foreground pt-0">
                                            {txt.saved_on} {new Date(app.created_at).toLocaleDateString()}
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed shadow-none bg-muted/30">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                <h3 className="font-semibold text-lg text-muted-foreground">{txt.no_jobs_title}</h3>
                                <p className="text-sm text-muted-foreground/70 max-w-sm mt-1 mb-6">
                                    {txt.no_jobs_desc}
                                </p>
                                <Button asChild variant="outline">
                                    <Link href="/candidate/jobs">{txt.find_jobs}</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* 3. Profile & Stats */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Status Card */}
                    <Card className="h-full flex flex-col justify-between overflow-hidden relative border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full" />

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-indigo-500" />
                                {txt.profile_status}
                            </CardTitle>
                            <CardDescription>{txt.control_visibility}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border">
                                <div className="space-y-0.5">
                                    <span className="text-sm font-medium block">{txt.open_to_work}</span>
                                    <span className="text-xs text-muted-foreground block">
                                        {isOpen ? txt.visible : txt.hidden}
                                    </span>
                                </div>
                                <Switch
                                    checked={isOpen}
                                    onCheckedChange={handleStatusToggle}
                                    className={`${isOpen ? "bg-green-500" : "bg-input"}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <Button asChild className="w-full justify-between" variant="outline">
                                    <Link href="/candidate/onboarding">
                                        {txt.edit_profile} <Edit className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild className="w-full justify-between" variant="ghost">
                                    <Link href="/candidate/cv">
                                        {txt.view_cv} <ExternalLink className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                                {txt.performance}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                                        <Eye className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{txt.profile_views}</p>
                                        <p className="text-xs text-muted-foreground">{txt.last_30}</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">12</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{txt.search_hits}</p>
                                        <p className="text-xs text-muted-foreground">{txt.matched_keywords}</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold">48</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recruiter View Preview (Collapsed/Small) */}
                    <div className="lg:col-span-1">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500" />
                            <div className="relative">
                                <div className="absolute top-2 right-2 z-10 w-full flex justify-end px-2">
                                    <Badge className="bg-black/70 backdrop-blur text-white border-0 shadow-lg">{txt.recruiter_preview}</Badge>
                                </div>
                                {/* Scaled down card */}
                                <div className="transform scale-[0.85] origin-top -mb-16 pointer-events-none select-none">
                                    <CandidateCard candidate={{ ...candidate, is_open: isOpen }} index={0} />
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>

            <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
        </div>
    );
}
