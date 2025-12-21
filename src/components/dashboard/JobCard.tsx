import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building2, ExternalLink, CalendarDays, Briefcase, Bookmark, ChevronRight, Heart, UserSearch, Loader2, Check } from "lucide-react"
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
}

export function JobCard({ job, index, initialSaved = false }: JobCardProps) {
    const isRecent = new Date(job.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [saved, setSaved] = useState(initialSaved)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSaveToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (loading) return

        // Optimistic update
        const previousSaved = saved
        setSaved(!saved)

        // Don't set loading true for UI to keep it snappy, prevent multiple clicks with internal flag if needed,
        // but for now relying on optimistic UI is enough.

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                window.location.href = '/login'
                return
            }

            if (previousSaved) {
                // Was saved, so delete
                const { error } = await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('job_id', job.id)
                    .eq('user_id', user.id)

                if (error) throw error
            } else {
                // Was not saved, so insert
                const { error } = await supabase
                    .from('saved_jobs')
                    .insert({
                        job_id: job.id,
                        user_id: user.id,
                        job_data: job
                    })

                if (error) throw error
            }
        } catch (error) {
            console.error('Error toggling save:', error)
            setSaved(previousSaved) // Revert on error
            // toast.error("Failed to save job")
        }
    }

    const [enriching, setEnriching] = useState(false)
    const [lead, setLead] = useState<any>(null)

    const handleEnrich = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setEnriching(true)

        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock data logic based on company to make it feel slightly real
        const mockStart = job.company.substring(0, 1).toUpperCase()
        setLead({
            name: mockStart === 'A' ? "Anna Andersson" : "Erik Svensson",
            role: "Talent Acquisition Manager",
            email: `rekrytering@${job.company.toLowerCase().replace(/\s/g, '')}.se`,
            phone: "+46 70 123 45 67"
        })
        setEnriching(false)
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
                                href={`/?search=${encodeURIComponent(job.company)}`}
                                className="hover:text-indigo-600 hover:underline transition-colors cursor-pointer"
                                title={`View all jobs at ${job.company}`}
                            >
                                {job.company}
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" />
                                <{job.location || "Remote / Unknown"}
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
                                className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md"
                            >
                                <div className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold mb-2 flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Decision Maker Found
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                                        {lead.name[0]}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-semibold text-foreground">{lead.name}</div>
                                        <div className="text-xs text-muted-foreground">{lead.role}</div>
                                        <div className="text-xs text-indigo-400 mt-1 select-all">{lead.email}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="pt-2 pb-4 z-10 relative gap-2 flex-col">
                    {!lead ? (
                        <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 border-0"
                            onClick={handleEnrich}
                            disabled={enriching}
                        >
                            {enriching ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scanning LinkedIn...
                                </>
                            ) : (
                                <>
                                    <UserSearch className="mr-2 h-4 w-4" />
                                    Find Decision Maker
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button variant="outline" className="w-full border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-700 bg-green-500/5">
                            <Check className="mr-2 h-4 w-4" />
                            Lead Saved to CRM
                        </Button>
                    )}

                    <a
                        href={job.webbplatsurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                    >
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                            <span className="mr-2">View Job Ad</span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-50" />
                        </Button>
                    </a>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
