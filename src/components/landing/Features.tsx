"use client";

import { Zap, Search, Mail, Users, BarChart3, Lock } from "lucide-react";

const FEATURES = [
    {
        icon: Search,
        title: "Lead Intelligence",
        description: "Identify hiring companies before they post. We monitor thousands of sources to find hidden opportunities."
    },
    {
        icon: Users,
        title: "Contact Finder",
        description: "Enrich leads with decision-maker emails instantly. Stop guessing and start connecting."
    },
    {
        icon: Mail,
        title: "AI Outreach",
        description: "Generate personalized, multi-language pitches in seconds using our advanced AI templates."
    },
    {
        icon: Zap,
        title: "Talent Marketplace",
        description: "Need speed? Access our curated database of verified, open-to-work candidates ready to interview."
    },
    {
        icon: BarChart3,
        title: "Pipeline CRM",
        description: "Manage your entire workflow from 'New Lead' to 'Hired' in one intuitive Kanban view."
    },
    {
        icon: Lock,
        title: "Enterprise Grade",
        description: "Built for scale with SSO, Role-Based Access Control, and compliant data handling."
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-black/20 relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        The Recruitment <br />
                        <span className="text-indigo-400">Operating System</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Tintel replaces your fragmented toolstack. One platform to find, contact, and close the best talent.
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
