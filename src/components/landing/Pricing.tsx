"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TIERS = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for independent recruiters.",
        features: [
            "Access to all job listings",
            "Basic filtering",
            "5 Lead Enriches / month",
            "Personal Kanban Board"
        ],
        cta: "Start Free",
        href: "/signup",
        popular: false
    },
    {
        name: "Pro",
        price: "1900",
        period: "/mo",
        description: "For agencies scaling up.",
        features: [
            "Unlimited Lead Enrichment",
            "Advanced AI Pitch Generator",
            "Company Market Intelligence",
            "Priority Support",
            "Export to CSV"
        ],
        cta: "Get Pro",
        href: "/signup?plan=pro",
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large teams and firms.",
        features: [
            "API Access",
            "White-labeling",
            "Dedicated Account Manager",
            "Custom Integrations",
            "SLA"
        ],
        cta: "Contact Sales",
        href: "mailto:sales@tintel.se",
        popular: false
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Start for free, upgrade when you close your first deal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {TIERS.map((tier, i) => (
                        <div
                            key={i}
                            className={`relative flex flex-col p-8 rounded-2xl border ${tier.popular ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 bg-white/5'} transition-transform hover:-translate-y-1 duration-300`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
                                <p className="text-muted-foreground text-sm h-10">{tier.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">
                                    {tier.price === "Custom" ? "Custom" : `${tier.price} kr`}
                                </span>
                                {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature, f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={tier.popular ? "default" : "outline"}
                                className={`w-full h-12 ${tier.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-white/20 text-white hover:bg-white/10'}`}
                                asChild
                            >
                                <Link href={tier.href}>{tier.cta}</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
