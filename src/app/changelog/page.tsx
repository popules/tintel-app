import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Shield, Search } from "lucide-react";

export default function ChangelogPage() {
    const versions = [
        {
            version: "2.0.0",
            date: "December 24, 2025",
            title: "The AI Revolution Update",
            description: "A major overhaul introducing real AI capabilities for both candidates and recruiters. Tintel is now smarter, faster, and more helpful than ever.",
            features: [
                { icon: Search, text: "Smart Search (Vector Embeddings): Find candidates by meaning, not just keywords. Searching 'Frontend Wizard' now finds React Experts." },
                { icon: Sparkles, text: "Magic Fill: One-click bio generation for candidates using OpenAI." },
                { icon: Zap, text: "Draft Pitch: Recruiters can generate personalized outreach emails in seconds." },
                { icon: Shield, text: "Find Lead Detective: Our hybrid scraper now bypasses blockers to find hiring managers straight from the source." },
                { icon: Zap, text: "Image Compression: Faster uploads and optimized storage for profile pictures." }
            ]
        },
        {
            version: "1.5.0",
            date: "December 10, 2025",
            title: "Recruiter Productivity Pack",
            description: "Focusing on tools to help recruiters manage leads and collaborate.",
            features: [
                { icon: Check, text: "Kanban Board for tracking candidate stages." },
                { icon: Check, text: "Credit System introduced for profile unlocks." },
                { icon: Check, text: "Team workspaces (Beta)." }
            ]
        },
        {
            version: "1.0.0",
            date: "November 1, 2025",
            title: "Initial Launch",
            description: "Tintel goes live! The modern intelligence platform for Swedish recruitment.",
            features: [
                { icon: Check, text: "Aggregated Job Search from major Swedish platforms." },
                { icon: Check, text: "Candidate Profile Creation." },
                { icon: Check, text: "Basic filtering by county and role." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <Badge variant="secondary" className="mb-2">Product Updates</Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Changelog
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        See what's new in Tintel. We ship updates weekly to build the world's most intelligent recruitment platform.
                    </p>
                </div>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                    {versions.map((v, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Timeline Dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-500/20 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110 group-hover:border-indigo-500">
                                <Sparkles className="h-5 w-5 text-indigo-500" />
                            </div>

                            {/* Content Card */}
                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 shadow-sm border-indigo-500/10 hover:border-indigo-500/30 transition-all bg-card/50 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-sm text-indigo-500 font-bold">{v.version}</span>
                                    <time className="text-xs text-muted-foreground font-medium">{v.date}</time>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{v.description}</p>
                                <div className="space-y-2">
                                    {v.features.map((f, fi) => (
                                        <div key={fi} className="flex items-start gap-2 text-sm">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                                                <f.icon className="h-3 w-3" />
                                            </div>
                                            <span>{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
