"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n-context";

export function Pricing() {
    const { t } = useTranslation();

    const txt = t.public.pricing;

    const TIERS = [
        {
            name: txt.starter.name,
            price: txt.starter.price,
            description: txt.starter.description,
            features: [
                txt.features.unlimited_search,
                txt.features.five_unlocks,
                txt.features.basic_kanban,
                txt.features.community
            ],
            cta: txt.starter.button,
            href: "/signup",
            popular: false
        },
        {
            name: txt.pro.name,
            price: txt.pro.price,
            period: txt.pro.period,
            description: txt.pro.description,
            features: [
                txt.everything_starter,
                txt.features.five_hundred_unlocks,
                txt.features.ai_pitch_unlimited,
                txt.features.vector_match,
                txt.features.detective
            ],
            cta: txt.pro.button,
            href: "/signup?plan=pro&priceId=price_1SiNAhA7zW1DXhtp0myVyevQ",
            popular: true
        },
        {
            name: txt.enterprise.name,
            price: txt.enterprise.price,
            description: txt.enterprise.description,
            features: [
                txt.everything_pro,
                txt.features.unlimited_unlocks,
                txt.features.api_full,
                txt.features.whitelabel,
                txt.features.account_manager
            ],
            cta: txt.enterprise.button,
            href: "mailto:sales@tintel.se",
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                        {txt.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {txt.desc}
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
                                    {txt.pro.badge}
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
