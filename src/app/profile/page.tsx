"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Trophy, Target, TrendingUp, Shield, MapPin, Globe, Loader2, CheckCircle2, AlertCircle, Radar } from "lucide-react";
import { motion } from "framer-motion";
import { SwedenMap } from "@/components/dashboard/SwedenMap";
import { useTranslation } from "@/lib/i18n-context";

// Simple Progress component
const Progress = ({ value = 0, className = "" }: { value?: number, className?: string }) => (
    <div className={`w-full bg-secondary h-2 rounded-full overflow-hidden ${className}`}>
        <div className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${value}%` }} />
    </div>
);

export default function ProfilePage() {
    const { t } = useTranslation();
    const txt = t.profile;
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
    const [updating, setUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const supabase = createClient();

    const allCounties = [
        "Blekinge län", "Dalarnas län", "Gotlands län", "Gävleborgs län",
        "Hallands län", "Jämtlands län", "Jönköpings län", "Kalmar län",
        "Kronobergs län", "Norrbottens län", "Skåne län", "Stockholms län",
        "Södermanlands län", "Uppsala län", "Värmlands län", "Västerbottens län",
        "Västernorrlands län", "Västmanlands län", "Västra Götalands län",
        "Örebro län", "Östergötlands län"
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();

                if (data) {
                    setProfile(data);
                    setSelectedTerritories(data.territories || []);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    const toggleTerritory = (county: string) => {
        if (selectedTerritories.includes(county)) {
            setSelectedTerritories(selectedTerritories.filter(t => t !== county));
        } else {
            setSelectedTerritories([...selectedTerritories, county]);
        }
    };

    const savePreferences = async () => {
        if (!user) return;
        setUpdating(true);
        setShowSuccess(false);
        setErrorMsg(null);

        try {
            // Unify Home City with the first selected territory
            const homeCity = selectedTerritories.length > 0 ? selectedTerritories[0] : "";

            const { error } = await supabase
                .from("profiles")
                .update({
                    home_city: homeCity,
                    territories: selectedTerritories,
                    email_notification_enabled: profile.email_notification_enabled,
                    updated_at: new Date().toISOString()
                })
                .eq("id", user.id);

            if (error) throw error;

            // Refresh local profile
            setProfile({ ...profile, home_city: homeCity, territories: selectedTerritories });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            console.error("Failed to save preferences", err);
            setErrorMsg(txt.territory.error_save);
        } finally {
            setUpdating(false);
        }
    };

    // Real-time stats
    const [stats, setStats] = useState({
        leadsContacted: 0,
        leadsGoal: 50,
        savedJobs: 0,
        responseRate: "15%",
        currentLevel: "Scout",
        nextLevel: "Hunter"
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            const { count: savedCount } = await supabase
                .from('saved_jobs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const { count: contactedCount } = await supabase
                .from('saved_jobs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .neq('status', 'new');

            const totalLeads = contactedCount || 0;
            let currentLevel = "Scout";
            let nextLevel = "Hunter";
            let goal = 50;

            if (totalLeads >= 50) {
                currentLevel = "Hunter";
                nextLevel = "Elite";
                goal = 150;
            }

            setStats({
                leadsContacted: totalLeads,
                leadsGoal: goal,
                savedJobs: savedCount || 0,
                responseRate: "15%",
                currentLevel,
                nextLevel
            });
        };

        if (user) fetchStats();
    }, [user, supabase]);

    const progress = (stats.leadsContacted / stats.leadsGoal) * 100;

    return (
        <div className="bg-background min-h-screen pb-20 text-foreground">
            <Header />

            <main className="container mx-auto px-4 pt-24 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">{txt.title}</h1>
                    <p className="text-muted-foreground transition-all duration-300">{txt.subtitle}</p>
                </div>

                {loading ? (
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                ) : user ? (
                    <div className="grid gap-6">
                        {/* ID Card */}
                        <Card className="border-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl text-white overflow-hidden relative shadow-2xl shadow-indigo-500/10">
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Shield className="h-40 w-40" />
                            </div>
                            <CardContent className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
                                <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-400 to-purple-400 p-[2px] shadow-xl">
                                    <div className="h-full w-full rounded-2xl bg-black/40 flex items-center justify-center text-3xl font-bold">
                                        {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                                    </div>
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <h2 className="text-2xl font-bold">{profile?.full_name || "Agent"}</h2>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-200">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/30 text-indigo-100 border border-indigo-500/50">
                                        {profile?.membership_tier || "Free"} {txt.operative}
                                    </div>
                                </div>
                                <div className="ml-auto hidden md:block text-right">
                                    <div className="text-sm text-indigo-300 font-medium">{txt.rank_label}</div>
                                    <div className="text-3xl font-black tracking-widest uppercase text-white drop-shadow-md">{stats.currentLevel}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gamification Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-background/50 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{txt.stats.leads_contacted}</CardTitle>
                                    <Target className="h-4 w-4 text-indigo-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.leadsContacted}</div>
                                    <div className="w-full bg-secondary h-2 mt-3 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                                        {stats.leadsGoal - stats.leadsContacted} {txt.stats.more_to_reach} {stats.nextLevel}
                                    </p>
                                </CardContent>
                            </Card>
                            <Link href="/saved" className="block cursor-pointer group">
                                <Card className="h-full border-dashed border-2 group-hover:border-solid hover:border-amber-500/50 transition-all duration-300 bg-background/50 backdrop-blur-sm group-hover:bg-amber-500/[0.02]">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{txt.stats.saved_ops}</CardTitle>
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.savedJobs}</div>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                            {txt.stats.pipeline_text}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Card className="bg-background/50 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{txt.stats.response_rate}</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.responseRate}</div>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                        {txt.stats.tracking_text}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Territory Settings */}
                        <Card className="border border-muted/50 bg-background/50 backdrop-blur-sm overflow-hidden shadow-sm">
                            <CardHeader className="border-b border-muted/50 bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/10">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{txt.territory.title}</CardTitle>
                                        <CardDescription className="text-xs">{txt.territory.desc}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8 p-6">
                                <div className="grid gap-4">
                                    <div>
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500/80 block mb-1">{txt.territory.label}</label>
                                        <p className="text-[10px] text-muted-foreground mb-4 italic leading-relaxed">{txt.territory.help_text}</p>
                                    </div>

                                    {/* Email Notification Toggle */}
                                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-muted/50 mb-6">
                                        <div className="space-y-0.5">
                                            <span className="text-sm font-medium block flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-indigo-500" />
                                                Email Notifications
                                            </span>
                                            <span className="text-[10px] text-muted-foreground block">
                                                Receive daily job matches & updates
                                            </span>
                                        </div>
                                        <Switch
                                            checked={profile?.email_notification_enabled !== false} // Default to true if null
                                            onCheckedChange={(checked) => setProfile({ ...profile, email_notification_enabled: checked })}
                                            className={`${profile?.email_notification_enabled !== false ? "bg-indigo-500" : "bg-input"}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* List View */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {allCounties.map(county => {
                                                const isSelected = selectedTerritories.includes(county);
                                                const isPrimary = selectedTerritories[0] === county;
                                                return (
                                                    <button
                                                        key={county}
                                                        onClick={() => toggleTerritory(county)}
                                                        className={`px-3 py-2.5 rounded-xl text-[10px] font-bold border flex items-center justify-between transition-all duration-300 ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-background hover:bg-muted/30 text-muted-foreground border-muted'}`}
                                                    >
                                                        <span className="truncate pr-2">{county}</span>
                                                        <div className="flex items-center gap-2">
                                                            {isPrimary && (
                                                                <Badge variant="outline" className="text-[8px] h-4 px-1 border-indigo-200 text-indigo-500 bg-white">{txt.territory.primary}</Badge>
                                                            )}
                                                            {isSelected ? (
                                                                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50 flex-shrink-0" />
                                                            ) : (
                                                                <div className="h-1.5 w-1.5 rounded-full bg-muted flex-shrink-0" />
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Map View */}
                                        <div className="flex flex-col items-center justify-center bg-muted/20 rounded-2xl p-6 border border-muted/50 relative group">
                                            <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                                <Radar className="h-3 w-3" />
                                                {txt.territory.radar_label}
                                            </div>
                                            <SwedenMap
                                                selectedCounties={selectedTerritories}
                                                onToggleCounty={toggleTerritory}
                                                className="w-full max-w-[300px] h-auto"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-600 text-xs flex gap-3 items-start"
                                    >
                                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <p className="leading-relaxed font-medium">{errorMsg}</p>
                                    </motion.div>
                                )}

                                <div className="pt-6 border-t border-muted/50 flex flex-col sm:flex-row items-center gap-4">
                                    <Button
                                        onClick={savePreferences}
                                        disabled={updating}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto min-w-[200px] h-11 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {txt.territory.syncing}
                                            </>
                                        ) : (
                                            txt.territory.update_button
                                        )}
                                    </Button>

                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 text-emerald-600 font-black text-[11px] uppercase tracking-wider"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            {txt.territory.success}
                                        </motion.div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/10 rounded-3xl border border-dashed border-muted">
                        <User className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h2 className="text-xl font-bold mb-2">{txt.unauthorized_title}</h2>
                        <p className="text-muted-foreground mb-6 text-sm">{txt.unauthorized_desc}</p>
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl font-bold">
                            <Link href="/login">{txt.identify_button}</Link>
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
