"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { JobCard } from "@/components/dashboard/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobPost {
    id: string;
    title: string;
    company: string;
    broad_category: string;
    location: string;
    county: string;
    webbplatsurl: string;
    created_at: string;
}

export default function SavedJobsPage() {
    const [loading, setLoading] = useState(true);
    const [savedJobs, setSavedJobs] = useState<JobPost[]>([]);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("saved_jobs")
                .select("job_data")
                .eq("user_id", user.id);

            if (error) {
                console.error("Error fetching saved jobs:", error);
            } else if (data) {
                const jobs = data.map(item => item.job_data as JobPost);
                setSavedJobs(jobs);
            }

            setLoading(false);
        };

        fetchSavedJobs();
    }, [supabase, router]);

    return (
        <div className="bg-background min-h-screen">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Home className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Saved Leads</h1>
                        <p className="text-muted-foreground">Manage your potential opportunities</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                        ))}
                    </div>
                ) : savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {savedJobs.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} initialSaved={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                            <Heart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No saved jobs yet</h2>
                        <p className="text-muted-foreground mb-6">Start browsing and save opportunities to track them here.</p>
                        <Link href="/">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">Browse Jobs</Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
