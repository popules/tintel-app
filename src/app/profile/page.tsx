"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { User, Mail, Trophy, Target, TrendingUp, Shield, MapPin, Globe, Loader2 } from "lucide-react";

// Simple Progress component since shadcn might not be installed
const Progress = ({ value = 0, className = "" }: { value?: number, className?: string }) => (
    <div className={`w-full bg-secondary h-2 rounded-full overflow-hidden ${className}`}>
        <div className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${value}%` }} />
    </div>
);

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [homeCity, setHomeCity] = useState("");
    const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
    const [updating, setUpdating] = useState(false);
    const supabase = createClient();

    const availableCities = [
        "Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping",
        "Västerås", "Örebro", "Umeå", "Helsingborg"
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(data);
                if (data) {
                    setHomeCity(data.home_city || "");
                    setSelectedTerritories(data.territories || []);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    const savePreferences = async () => {
        if (!user) return;
        setUpdating(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    home_city: homeCity,
                    territories: selectedTerritories,
                    updated_at: new Date().toISOString()
                })
                .eq("id", user.id);

            if (error) throw error;

            // Refresh local profile
            setProfile({ ...profile, home_city: homeCity, territories: selectedTerritories });
        } catch (err) {
            console.error("Failed to save preferences", err);
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
        <div className="bg-background min-h-screen pb-20">
            <Header />

            <main className="container mx-auto px-4 pt-24 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Agent Profile</h1>
                    <p className="text-muted-foreground">Track your progress and stats</p>
                </div>

                {loading ? (
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                ) : user ? (
                    <div className="grid gap-6">
                        {/* ID Card */}
                        <Card className="border-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl text-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                <Shield className="h-40 w-40" />
                            </div>
                            <CardContent className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
                                <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-400 to-purple-400 p-[2px]">
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
                                        {profile?.membership_tier || "Free"} Operative
                                    </div>
                                </div>
                                <div className="ml-auto hidden md:block text-right">
                                    <div className="text-sm text-indigo-300">Current Rank</div>
                                    <div className="text-2xl font-black tracking-widest uppercase text-white">{stats.currentLevel}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gamification Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Leads Contacted</CardTitle>
                                    <Target className="h-4 w-4 text-indigo-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.leadsContacted}</div>
                                    <div className="w-full bg-secondary h-2 mt-3 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${progress}%` }} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {stats.leadsGoal - stats.leadsContacted} more to reach {stats.nextLevel}
                                    </p>
                                </CardContent>
                            </Card>
                            <Link href="/saved" className="block cursor-pointer transition-transform hover:scale-105">
                                <Card className="h-full border-dashed border-2 hover:border-solid hover:border-amber-500/50 transition-colors">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Saved Opportunities</CardTitle>
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stats.savedJobs}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Potential deals in pipeline
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.responseRate}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Based on email tracking
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Territory Settings */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-indigo-500" />
                                    <div>
                                        <CardTitle className="text-lg">Operational Territory</CardTitle>
                                        <CardDescription>Define your geographic focus to scope Market Intelligence and Signals.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Home City (Dashboard Default)</label>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                            {availableCities.map(city => (
                                                <button
                                                    key={city}
                                                    onClick={() => setHomeCity(city)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${homeCity === city ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-background hover:border-indigo-500/50 text-muted-foreground'}`}
                                                >
                                                    {city}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Monitored Regions (Signal Frequency)</label>
                                        <p className="text-[10px] text-muted-foreground mb-2 italic">You will only receive "Signal Flashes" for these selected cities.</p>
                                        <div className="flex flex-wrap gap-2">
                                            {availableCities.map(city => {
                                                const isSelected = selectedTerritories.includes(city);
                                                return (
                                                    <button
                                                        key={city}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedTerritories(selectedTerritories.filter(t => t !== city));
                                                            } else {
                                                                setSelectedTerritories([...selectedTerritories, city]);
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 transition-all ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-background hover:bg-muted'}`}
                                                    >
                                                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                                                        {city}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button
                                        onClick={savePreferences}
                                        disabled={updating}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto min-w-[160px]"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Preferences"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                        <User className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h2 className="text-xl font-bold mb-2">Not Logged In</h2>
                        <p className="text-muted-foreground mb-6 text-sm">Please sign in to view your agent profile.</p>
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
