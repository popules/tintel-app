import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Building2, ExternalLink, CalendarDays, Briefcase, Bookmark, ChevronRight, Heart, UserSearch, Loader2, Check, Wand2, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

interface JobPost {
    id: string
    title: string
    company: string
    location: string;
    created_at: string
    webbplatsurl: string
}

interface JobCardProps {
    job: JobPost
    index: number
    initialSaved?: boolean
    mode?: 'recruiter' | 'candidate' // Added mode
}

export function JobCard({ job, index, initialSaved = false, mode = 'recruiter' }: JobCardProps) {
    const isRecent = new Date(job.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [saved, setSaved] = useState(initialSaved)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // Sync state when parent data arrives
    useEffect(() => {
        setSaved(initialSaved)
    }, [initialSaved])

    const handleSaveToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (loading) return

        // Optimistic update
        const previousSaved = saved
        setSaved(!saved)
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                window.location.href = "/login"
                return
            }

            if (!previousSaved) {
                // Was not saved, so INSERT
                const { error } = await supabase
                    .from('saved_jobs')
                    .insert({ user_id: user.id, job_id: job.id, status: 'new' })

                if (error) {
                    if (error.code === '23505') {
                        // Duplicate key -> It's already saved. Keep UI as Saved.
                        setSaved(true)
                    } else {
                        throw error
                    }
                }
            } else {
                // Was saved, so DELETE
                const { error } = await supabase
                    .from('saved_jobs')
                    .delete()
                    .match({ user_id: user.id, job_id: job.id })

                if (error) throw error
            }
        } catch (error: any) {
            console.error(error)
            // Revert on real error (not duplicate)
            if (error.code !== '23505') {
                setSaved(previousSaved)
                alert(`Save failed: ${error.message}`)
            }
        } finally {
            setLoading(false)
        }
    }

    const [enriching, setEnriching] = useState(false)
    const [lead, setLead] = useState<any>(null)
    const [viewingAd, setViewingAd] = useState(false)
    const [adConfig, setAdConfig] = useState<any>(null)

    const handleEnrich = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setEnriching(true);

        try {
            let enrichedData = null;
            let description = null;

            // --- STRATEGY 1: CLIENT-SIDE FETCH (Bypass Vercel/Server IP Block) ---
            // If it is a Platsbanken URL, we can fetch directly from JobTech API in the browser!
            const pbIdMatch = job.webbplatsurl.match(/platsbanken\/annonser\/(\d+)/) || job.webbplatsurl.match(/platsbanken\/annons\/(\d+)/);

            if (pbIdMatch) {
                const adId = pbIdMatch[1];
                try {
                    // Fetch from JobTech Public API (CORS enabled usually)
                    const res = await fetch(`https://jobsearch.api.jobtechdev.se/ad/${adId}`, {
                        headers: { "Accept": "application/json" }
                    });
                    if (res.ok) {
                        const adData = await res.json();
                        description = adData.description?.text;

                        if (description) {
                            // We have the text! Now send it to the server for AI analysis
                            const { analyzeJobText } = await import("@/app/actions/ai");
                            const aiRes = await analyzeJobText(description); // Send text to OpenAI 

                            if (aiRes.success && aiRes.data) {
                                enrichedData = aiRes.data;
                            }
                        }
                    }
                } catch (clientErr) {
                    console.warn("Client-side fetch failed, falling back to server proxy", clientErr);
                }
            }

            // --- STRATEGY 2: SERVER PROXY FALLBACK (Old Way) ---
            if (!enrichedData) {
                const res = await fetch(`/api/scrape-job?url=${encodeURIComponent(job.webbplatsurl)}`);
                enrichedData = await res.json();
                description = enrichedData.description || description;
            }

            // Apply Data
            setLead({
                name: enrichedData.name || "Hiring Manager",
                role: enrichedData.role || "Recruiter",
                email: enrichedData.email || null,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${enrichedData.email || job.company}`,
                company: job.company
            });

            if (description) {
                setAdConfig({ description: description });
            }

        } catch (e) {
            console.error(e);
            alert("Could not find contact details.");
            setLead({
                name: "No direct contact found",
                role: "N/A",
                email: null,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.company}`,
                company: job.company
            });
        } finally {
            setEnriching(false);
        }
    };

    const [pitch, setPitch] = useState<string | null>(null)
    const [generatingPitch, setGeneratingPitch] = useState(false)

    const handleGeneratePitch = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setGeneratingPitch(true)

        try {
            // Smart Name Extraction
            let name = "Hiring Team";
            if (lead?.name && lead.name !== "Hiring Manager" && lead.name !== "No direct contact found") {
                name = lead.name.split(' ')[0];
            } else if (lead?.email) {
                try {
                    const parts = lead.email.split('@')[0].split('.');
                    if (parts[0]) name = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                } catch (err) { /* fallback */ }
            }

            // Call Server Action
            const { generateRecruiterPitch } = await import("@/app/actions/ai");
            const result = await generateRecruiterPitch(
                job.title,
                job.company,
                name,
                lead?.role || null
            );

            if (result.success && result.data) {
                setPitch(result.data);
            } else {
                // Fallback to Template System if no AI Key
                console.warn("AI Pitch Failed, using templates:", result.error);

                // Expanded Professional Templates (10 variants)
                const templates = [
                    {
                        type: 'Direct',
                        se: `Hej ${name},\n\nJag såg er annons för ${job.title} på ${job.company}. Vi har precis en seniorkonsult ledig som matchar kraven (5+ år) och kan börja omgående. Är ni intresserade av att se profilen?`,
                        en: `Hi ${name},\n\nI saw your ad for the ${job.title} position at ${job.company}. We have a senior consultant available immediately who matches the requirements perfectly (5+ years exp). Would you be interested in seeing their profile?`
                    },
                    {
                        type: 'Consultant Focus',
                        se: `Hej ${name},\n\nAngående rollen som ${job.title}. Jag har en kandidat som precis avslutat ett liknande uppdrag och fick högsta betyg. Tänkte att personen kunde passa in bra på ${job.company}.\n\nSka jag skicka över CV?`,
                        en: `Hi ${name},\n\nRegarding the ${job.title} position. I have a candidate who just finished a similar assignment with top ratings. I thought they would be a great fit for ${job.company}.\n\nShould I send over the CV?`
                    },
                    {
                        type: 'Value Add',
                        se: `Hej ${name},\n\nVet att rekrytering tar tid. Om ni behöver stöttning med ${job.title} så har jag två starka kandidater tillgängliga för intervju denna vecka.\n\nHörs gärna kort om det är aktuellt.`,
                        en: `Hi ${name},\n\nI know recruitment takes time. If you need support with the ${job.title} role, I have two strong candidates available for interviews this week.\n\nHappy to have a quick chat if relevant.`
                    }
                ];

                const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
                const pitchText = `🇸🇪 SWEDISH (${randomTemplate.type})\n${randomTemplate.se}\n\n==========================\n\n🇬🇧 ENGLISH (${randomTemplate.type})\n${randomTemplate.en}`;
                setPitch(pitchText);
            }

        } catch (err) {
            console.error(err);
            alert("Could not generate pitch.");
        } finally {
            setGeneratingPitch(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 ring-1 ring-border/50 hover:ring-indigo-500/30">

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl transition-all group-hover:bg-indigo-500/20" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition-all group-hover:bg-purple-500/20" />

                <CardHeader className="pb-3 z-10 relative">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                                {isRecent && (
                                    <Badge variant="secondary" className="px-1.5 h-5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-0">
                                        NEW
                                    </Badge>
                                )}
                                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
                                    FULL-TIME
                                </span>
                            </div>
                            <CardTitle className="text-lg font-bold tracking-tight text-foreground/90 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
                                {job.title}
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mr-2 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-full"
                            onClick={handleSaveToggle}
                            disabled={loading}
                        >
                            <Heart className={`h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pb-4 z-10 relative">
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                            <div className="p-1 rounded bg-muted text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                            </div>
                            <a
                                href={`/company/${encodeURIComponent(job.company)}`}
                                className="hover:text-indigo-600 hover:underline transition-colors cursor-pointer"
                                title={`View all jobs at ${job.company}`}
                            >
                                {job.company}
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" />
                                {job.location || "Remote / Unknown"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="h-3 w-3" />
                                {new Date(job.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Enriched Lead Data Prototype */}
                        {lead && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center overflow-hidden">
                                        <img src={lead.avatar} alt={lead.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{lead.name}</p>
                                        <p className="text-xs text-muted-foreground">{lead.role}</p>
                                        {lead.email ? (
                                            <a href={`mailto:${lead.email}`} className="text-xs text-blue-500 hover:underline block">{lead.email}</a>
                                        ) : (
                                            <span className="text-xs text-amber-600 block">Indirect contact only</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                    <Check className="h-3 w-3" />
                                    {lead.email ? "Direct Contact" : "Company Identified"}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4 z-10 relative gap-2 flex-col">
                    {mode === 'recruiter' ? (
                        <>
                            {!lead ? (
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 border-0"
                                        onClick={handleEnrich}
                                        disabled={enriching}
                                    >
                                        {enriching ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <UserSearch className="mr-2 h-4 w-4" />
                                                Find Lead
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-indigo-500/20 text-indigo-600 hover:bg-indigo-50"
                                        onClick={handleGeneratePitch}
                                        disabled={generatingPitch}
                                    >
                                        {generatingPitch ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Wand2 className="mr-2 h-4 w-4" />
                                                Draft Pitch
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <div className="w-full space-y-2">
                                    <Button variant="outline" className="w-full border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-700 bg-green-500/5 cursor-default">
                                        <Check className="mr-2 h-4 w-4" />
                                        Lead Saved
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-indigo-500/20 text-indigo-600 hover:bg-indigo-50"
                                        onClick={handleGeneratePitch}
                                        disabled={generatingPitch}
                                    >
                                        {generatingPitch ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Wand2 className="mr-2 h-4 w-4" />
                                                {pitch ? "Regenerate Pitch" : "Draft Pitch"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {pitch && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 w-full"
                                >
                                    <div className="relative rounded-md border bg-muted/50 p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                        {pitch}
                                        <Button size="sm" variant="ghost" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(pitch) }}>
                                            <Check className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    ) : (
                        // CANDIDATE VIEW
                        <div className="w-full">
                            <Button
                                className="w-full bg-white text-black hover:bg-gray-200 border border-input shadow-sm mb-2"
                                onClick={async () => {
                                    // TRACK APPLICATION
                                    try {
                                        const { trackApplication } = await import("@/app/actions/application");
                                        await trackApplication({
                                            id: job.id,
                                            title: job.title,
                                            company: job.company,
                                            url: job.webbplatsurl,
                                            location: job.location,
                                            created_at: job.created_at,
                                            description: adConfig?.description
                                        });
                                        // Open Original
                                        window.open(job.webbplatsurl, '_blank');
                                    } catch (err) {
                                        console.error("Tracking failed", err);
                                        window.open(job.webbplatsurl, '_blank');
                                    }
                                }}
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Apply on Site
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2 w-full">
                        <Dialog open={viewingAd} onOpenChange={setViewingAd}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full text-muted-foreground hover:text-foreground"
                                    onClick={async (e) => {
                                        // If we already have the description, just open
                                        if (adConfig?.description) return;

                                        // Otherwise, scrape it first
                                        e.preventDefault();
                                        setLoading(true); // Reuse loading state or add new one
                                        try {
                                            const res = await fetch(`/api/scrape-job?url=${encodeURIComponent(job.webbplatsurl)}`)
                                            const data = await res.json()
                                            setAdConfig({ description: data.description || "No description available." })
                                            setViewingAd(true)
                                        } catch (err) {
                                            // Fallback to external if scrape fails
                                            window.open(job.webbplatsurl, '_blank')
                                        } finally {
                                            setLoading(false)
                                        }
                                    }}
                                >
                                    <span className="mr-2">View Job Ad</span>
                                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5 opacity-50" />}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                                <DialogHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="w-fit">{job.company}</Badge>
                                        <span className="text-xs text-muted-foreground">{job.location}</span>
                                    </div>
                                    <DialogTitle className="text-xl">{job.title}</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[60vh] w-full mt-4 rounded-md bg-muted/30 border p-4">
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans pr-4">
                                        {adConfig?.description}
                                    </div>
                                </ScrollArea>
                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setViewingAd(false)}>Close</Button>
                                    <Button onClick={async () => {
                                        // TRACK APPLICATION (Magic Click)
                                        try {
                                            const { trackApplication } = await import("@/app/actions/application");
                                            await trackApplication({
                                                id: job.id,
                                                title: job.title,
                                                company: job.company,
                                                url: job.webbplatsurl,
                                                location: job.location,
                                                created_at: job.created_at, // Add this to type def in action if needed, or omit
                                                description: adConfig?.description
                                            });
                                        } catch (err) {
                                            console.error("Tracking failed", err);
                                        }
                                        // Open Original
                                        window.open(job.webbplatsurl, '_blank');
                                    }}>
                                        Apply on Site <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
