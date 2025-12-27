"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Briefcase, ExternalLink, GripVertical, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { updateApplicationStatus } from "@/app/actions/application";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n-context";

// DND Kit Imports
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Application = {
    id: string;
    job_title: string;
    company_name: string;
    status: string;
    job_url: string;
    job_data: any;
    notes: string;
    created_at: string;
};

// --- Sortable Item Component ---
function SortableCard({ app, statusColor }: { app: Application, statusColor: string }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: app.id, data: { type: 'card', app } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <motion.div
                layoutId={app.id}
                className="group relative bg-black/40 hover:bg-zinc-900 border border-white/10 hover:border-indigo-500/30 rounded-lg p-3 shadow-sm transition-all"
            >
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight" title={app.job_title}>
                        {app.job_title}
                    </h4>
                    <GripVertical className="h-3 w-3 text-zinc-700 group-hover:text-zinc-500 shrink-0 mt-1" />
                </div>

                <div className="text-xs text-muted-foreground mb-3 font-medium">
                    {app.company_name}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-zinc-500">
                        {new Date(app.created_at).toLocaleDateString()}
                    </span>
                    <a href={app.job_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:text-white hover:bg-white/10">
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    </a>
                </div>
            </motion.div>
        </div>
    );
}

// --- Main Page ---
export default function MyJobsPage() {
    const { t } = useTranslation();
    const txt = t.pipeline.candidate;

    const [applications, setApplications] = useState<Application[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const COLUMNS = useMemo(() => [
        { id: 'saved', title: txt.columns.saved, color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
        { id: 'applied', title: txt.columns.applied, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
        { id: 'interview', title: txt.columns.interview, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        { id: 'offer', title: txt.columns.offer, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
        { id: 'rejected', title: txt.columns.rejected, color: 'bg-red-500/10 text-red-500 border-red-500/20' }
    ], [txt]);

    // Sensors for DND
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchApps = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/candidate/login"); return; }

            const { data } = await supabase
                .from('applications')
                .select('*')
                .eq('candidate_id', user.id);

            if (data) setApplications(data as Application[]);
            setLoading(false);
        };
        fetchApps();
    }, [router, supabase]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeApp = applications.find(a => a.id === activeId);
        if (!activeApp) return;

        // If hovering over a column id
        const isOverAColumn = COLUMNS.some(col => col.id === overId);

        if (isOverAColumn && activeApp.status !== overId) {
            setApplications(apps => apps.map(app =>
                app.id === activeId ? { ...app, status: overId } : app
            ));
        } else {
            // Over another card
            const overApp = applications.find(a => a.id === overId);
            if (overApp && activeApp.status !== overApp.status) {
                setApplications(apps => apps.map(app =>
                    app.id === activeId ? { ...app, status: overApp.status } : app
                ));
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeApp = applications.find(a => a.id === active.id);
        if (activeApp) {
            const result = await updateApplicationStatus(activeApp.id, activeApp.status);
            if (result.success) {
                toast.success(`Updated to ${activeApp.status}`);
            } else {
                toast.error("Failed to sync change");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const activeApp = activeId ? applications.find(a => a.id === activeId) : null;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                            {txt.title}
                        </h1>
                        <p className="text-muted-foreground text-lg">{txt.subtitle}</p>
                    </div>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => router.push('/candidate/jobs')}>
                        <Briefcase className="mr-2 h-4 w-4" /> {txt.find_more}
                    </Button>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-8 min-w-[1000px]">
                        {COLUMNS.map(col => (
                            <div key={col.id} id={col.id} className="flex flex-col h-full min-h-[500px] bg-zinc-900/30 rounded-xl border border-white/5 p-4 space-y-4">
                                <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${col.color}`}>
                                    <h3 className="font-bold text-xs uppercase tracking-wide">{col.title}</h3>
                                    <Badge variant="outline" className="text-xs opacity-50 font-mono border-white/10">
                                        {applications.filter(a => a.status === col.id).length}
                                    </Badge>
                                </div>

                                <SortableContext items={applications.filter(a => a.status === col.id).map(a => a.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3 flex-1">
                                        {applications.filter(a => a.status === col.id).map(app => (
                                            <SortableCard key={app.id} app={app} statusColor={col.color} />
                                        ))}
                                        {applications.filter(a => a.status === col.id).length === 0 && (
                                            <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg text-muted-foreground/10 text-[10px] uppercase font-bold tracking-widest">
                                                {txt.empty}
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </div>
                        ))}
                    </div>

                    <DragOverlay dropAnimation={{
                        sideEffects: defaultDropAnimationSideEffects({
                            styles: { active: { opacity: '0.5' } },
                        }),
                    }}>
                        {activeApp ? (
                            <div className="bg-zinc-900 border border-indigo-500/50 rounded-lg p-3 shadow-2xl rotate-2">
                                <h4 className="font-semibold text-sm line-clamp-1">{activeApp.job_title}</h4>
                                <p className="text-xs text-muted-foreground">{activeApp.company_name}</p>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}
