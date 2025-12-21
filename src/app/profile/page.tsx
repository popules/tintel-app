"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Need to ensure this exists or use standard div
import { User, Mail, Trophy, Target, TrendingUp, Shield } from "lucide-react";

// Simple Progress component if not in UI lib yet, or we assume shadcn installed it.
// If not installed, I'll use a standard implementation.
// Let's assume user has it or I can mock it easily.
// I'll stick to basic tailwind for progress to be safe.

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

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
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    // Mock gamification data if not in DB yet
    const stats = {
        leadsContacted: 12,
        leadsGoal: 50,
        savedJobs: 5, // We could fetch this count real-time
        responseRate: "15%",
        currentLevel: "Scout",
        nextLevel: "Hunter"
    };

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
                            <Card>
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
                    </div>
                ) : (
                    <div>Not logged in</div>
                )}
            </main>
        </div>
    );
}
