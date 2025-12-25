"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, MapPin, Briefcase, Edit, Eye, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { CandidateCard } from "@/components/dashboard/CandidateCard";

export default function CandidateDashboardPage() {
    const [candidate, setCandidate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/candidate/login");
                return;
            }

            // Security Check: Ensure user is a candidate
            if (user.user_metadata?.role !== 'candidate') {
                // Redirect recruiters to their own dashboard if they stumble here
                router.push("/dashboard");
                return;
            }

            const { data, error } = await supabase
                .from("candidates")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error("Error fetching profile:", error);
            }

            if (data) {
                setCandidate(data);
                setIsOpen(data.is_open);
            } else {
                // No profile yet, redirect to onboarding
                router.push("/candidate/onboarding");
            }
            setLoading(false);
        };

        fetchProfile();
    }, [router]);

    const handleStatusToggle = async (checked: boolean) => {
        setUpdatingStatus(true);
        // Optimistic update
        setIsOpen(checked);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("candidates")
            .update({ is_open: checked })
            .eq("id", user.id);

        if (error) {
            console.error("Error updating status:", error);
            setIsOpen(!checked); // Revert on error
            // toast.error("Failed to update status");
        } else {
            setCandidate({ ...candidate, is_open: checked });
        }
        setUpdatingStatus(false);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!candidate) return null; // Redirecting...

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Candidate Profile</h1>
                        <p className="text-muted-foreground mt-1">Manage your professional presence and availability.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-lg border border-border/50">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {isOpen ? "Visible to Recruiters" : "Hidden from Search"}
                            </span>
                            {updatingStatus && <span className="text-[10px] text-muted-foreground animate-pulse">Updating...</span>}
                        </div>
                        <Switch
                            checked={isOpen}
                            onCheckedChange={handleStatusToggle}
                            className={`${isOpen ? "bg-green-500" : "bg-input"}`}
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Stats & Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-indigo-500" />
                                        <span className="font-medium">Profile Views</span>
                                    </div>
                                    <span className="font-bold text-lg">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                        <span className="font-medium">Search Appearances</span>
                                    </div>
                                    <span className="font-bold text-lg">48</span>
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs text-muted-foreground">
                                        Your profile is performing well. Add more skills to increase visibility.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button asChild className="w-full justify-start bg-indigo-600 text-white hover:bg-indigo-700">
                                    <Link href="/candidate/jobs">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Find Jobs
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href="/candidate/onboarding">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profile Details
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                                    <Link href="/candidate/cv">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Public Profile
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle & Right: The "Smooth CV" Preview */}
                    <div className="md:col-span-2">
                        <div className="relative">
                            <div className="absolute -top-3 -right-3 z-10">
                                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg">
                                    Recruiter View
                                </Badge>
                            </div>

                            {/* We reuse the CandidateCard component but maybe we want a standard view here? 
                                Actually, reusing the card shows them EXACTLY what recruiters see. Perfect.
                            */}
                            <div className="pointer-events-none select-none"> {/* Disable interaction on the preview */}
                                <CandidateCard candidate={{ ...candidate, is_open: isOpen }} index={0} />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <p className="text-xs text-muted-foreground italic">
                                    * This card is how you appear in search results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
