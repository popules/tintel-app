"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Briefcase, ChevronRight, X, ExternalLink, MessageSquare, CheckCircle2, Clock, Ban, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateApplicationStatus } from "@/app/actions/application";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Application = {
    id: string;
    job_title: string;
    company_name: string;
    status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected' | 'ghosted';
    job_url: string;
    job_data: any;
    notes: string;
    created_at: string;
};

const COLUMNS = [
    { id: 'saved', title: 'Saved / Interested', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
    { id: 'applied', title: 'Applied', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { id: 'interview', title: 'Interview', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { id: 'offer', title: 'Offer', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
];

export default function MyJobsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchApps = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/candidate/login");
                return;
            }

            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .eq('candidate_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setApplications(data as Application[]);
            setLoading(false);
        };
        fetchApps();
    }, [router, supabase]);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        // Optimistic update
        const oldApps = [...applications];
        setApplications(apps => apps.map(app =>
            app.id === appId ? { ...app, status: newStatus as any } : app
        ));

        const result = await updateApplicationStatus(appId, newStatus);

        if (result.success) {
            toast.success(`Moved to ${newStatus}`);
        } else {
            setApplications(oldApps); // Revert
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                            My Pipeline
                        </h1>
                        <p className="text-muted-foreground text-lg">Track your applications and manage your career.</p>
                    </div>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => router.push('/candidate/jobs')}>
                        <Briefcase className="mr-2 h-4 w-4" /> Find More Jobs
                    </Button>
                </div>

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-8">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex flex-col h-full min-h-[500px] bg-zinc-900/30 rounded-xl border border-white/5 p-4 space-y-4">

                            {/* Column Header */}
                            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${col.color}`}>
                                <h3 className="font-bold text-sm uppercase tracking-wide">{col.title}</h3>
                                <span className="text-xs font-mono opacity-70">
                                    {applications.filter(a => a.status === col.id).length}
                                </span>
                            </div>

                            {/* Droppable Area / List */}
                            <div className="space-y-3 flex-1">
                                {applications.filter(a => a.status === col.id).map(app => (
                                    <motion.div
                                        key={app.id}
                                        layoutId={app.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="group relative bg-black/40 hover:bg-zinc-900 border border-white/10 hover:border-indigo-500/30 rounded-lg p-3 shadow-sm transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-sm line-clamp-2 leading-tight" title={app.job_title}>
                                                {app.job_title}
                                            </h4>
                                        </div>

                                        <div className="text-xs text-muted-foreground mb-3 font-medium">
                                            {app.company_name}
                                        </div>

                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                            <span className="text-[10px] text-zinc-500">
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </span>

                                            <div className="flex gap-1">
                                                <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:text-white hover:bg-white/10">
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Button>
                                                </a>

                                                {/* Move Dropdown */}
                                                <Select onValueChange={(val) => handleStatusChange(app.id, val)}>
                                                    <SelectTrigger className="h-6 w-6 p-0 border-0 bg-transparent hover:bg-white/10 data-[state=open]:bg-white/10 [&>svg]:hidden flex justify-center items-center rounded-full">
                                                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                                                    </SelectTrigger>
                                                    <SelectContent align="end">
                                                        {COLUMNS.map(c => (
                                                            <SelectItem key={c.id} value={c.id} disabled={c.id === app.status}>
                                                                Move to {c.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {applications.filter(a => a.status === col.id).length === 0 && (
                                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg text-muted-foreground/30 text-xs">
                                        Empty
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
