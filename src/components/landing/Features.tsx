"use client";

import { Zap, Search, Mail, Users, BarChart3, Lock } from "lucide-react";

const FEATURES = [
    {
        icon: Search,
        title: "Smart Aggregation",
        description: "We scrape thousands of sources daily to find every relevant job opportunity in real-time."
    },
    {
        icon: Users,
        title: "Lead Enrichment",
        description: "Instantly find hiring managers' names and direct email addresses. No more 'To whom it may concern'."
    },
    {
        icon: Mail,
        title: "AI Outreach",
        description: "Generate personalized, multi-language pitches in seconds using our advanced AI templates."
    },
    {
        icon: Zap,
        title: "Kanban Pipeline",
        description: "Manage your leads with a drag-and-drop CRM built specifically for high-velocity recruitment."
    },
    {
        icon: BarChart3,
        title: "Market Intelligence",
        description: "Track company growth, hiring velocity, and competitor movements with deep data analytics."
    },
    {
        icon: Lock,
        title: "Enterprise Grade",
        description: "Built with security first. SSO, Role-Based Access Control, and compliant data handling."
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-black/20 relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        Everything you need to <br />
                        <span className="text-indigo-400">dominate the market</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Tintel isn't just a job board. It's a complete operating system for modern recruitment agencies.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, i) => (
                        <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300">
                            <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
