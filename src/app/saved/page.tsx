"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { JobCard } from "@/components/dashboard/JobCard";
import { motion } from "framer-motion";
import { Loader2, Kanban, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedJob {
    id: number;
    job_id: string;
    user_id: string;
    created_at: string;
    job_data: any;
    status: 'new' | 'contacted' | 'meeting' | 'closed';
    pitch?: string;
}

const COLUMNS = [
    { id: 'new', label: 'New Leads', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
    { id: 'contacted', label: 'Contacted', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
    { id: 'meeting', label: 'Meeting Booked', color: 'bg-purple-500/10 border-purple-500/20 text-purple-500' },
    { id: 'closed', label: 'Closed Deal', color: 'bg-green-500/10 border-green-500/20 text-green-500' },
];

export default function SavedJobsPage() {
    const [jobs, setJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    const fetchSavedJobs = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('saved_jobs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setJobs(data as SavedJob[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleMoveStatus = async (item: SavedJob, newStatus: string) => {
        // Optimistic update
        const updatedJobs = jobs.map(j => j.id === item.id ? { ...j, status: newStatus as any } : j);
        setJobs(updatedJobs);

        const { error } = await supabase
            .from('saved_jobs')
            .update({ status: newStatus })
            .eq('id', item.id);

        if (error) {
            console.error("Error updating status:", error);
            fetchSavedJobs(); // Revert on error
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="flex-1 p-4 md:p-8 overflow-x-auto">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <Kanban className="h-6 w-6 text-indigo-500" />
                                My Pipeline
                            </h2>
                            <p className="text-muted-foreground text-sm">Manage your recruitment process.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-[1000px]">
                            {COLUMNS.map(column => {
                                const columnJobs = jobs.filter(j => (j.status || 'new') === column.id);
                                return (
                                    <div key={column.id} className="flex flex-col gap-4 h-full min-h-[500px] rounded-xl bg-muted/30 p-4 border border-border/50">
                                        <div className={`flex items-center justify-between p-3 rounded-lg border ${column.color} backdrop-blur-sm`}>
                                            <span className="font-semibold text-sm uppercase tracking-wider">{column.label}</span>
                                            <Badge className="bg-background/50 text-foreground border-0">
                                                {columnJobs.length}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                                            {columnJobs.map((item, index) => (
                                                <div key={item.id} className="relative group">
                                                    <div className="scale-90 origin-top-left transform transition-all duration-200 group-hover:scale-95">
                                                        <JobCard job={item.job_data} index={index} initialSaved={true} />
                                                    </div>

                                                    {/* Quick Move Actions Overlay */}
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-md rounded-lg p-1 flex gap-1 z-50">
                                                        {COLUMNS.map(c => (
                                                            c.id !== item.status && (
                                                                <button
                                                                    key={c.id}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleMoveStatus(item, c.id);
                                                                    }}
                                                                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors ${c.color} bg-background hover:brightness-110`}
                                                                    title={`Move to ${c.label}`}
                                                                >
                                                                    {c.label[0]}
                                                                </button>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            {columnJobs.length === 0 && (
                                                <div className="h-32 rounded-lg border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground text-xs">
                                                    Empty Stage
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>{children}</span>;
}
