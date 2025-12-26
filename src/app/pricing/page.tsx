"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n-context";

export default function PricingPage() {
    const { t } = useTranslation();
    const txt = t.public.pricing;
    const feats = txt.features;

    const tiers = [
        {
            name: txt.starter.name,
            description: txt.starter.description,
            price: txt.starter.price,
            features: [
                feats.unlimited_search,
                feats.five_unlocks,
                feats.basic_kanban,
                feats.community,
                feats.std_speed
            ],
            notIncluded: [
                feats.ai_pitch,
                feats.smart_search,
                feats.team_collab,
                feats.api
            ],
            button: txt.starter.button,
            variant: "outline"
        },
        {
            name: txt.pro.name,
            description: txt.pro.description,
            price: txt.pro.price,
            period: txt.pro.period,
            popular: true,
            features: [
                txt.everything_starter, // TODO: Maybe generalize this string if needed
                feats.five_hundred_unlocks,
                feats.ai_pitch_unlimited,
                feats.vector_match,
                feats.detective,
                feats.priority
            ],
            notIncluded: [
                feats.whitelabel,
                feats.account_manager
            ],
            button: txt.pro.button,
            variant: "default"
        },
        {
            name: txt.enterprise.name,
            description: txt.enterprise.description,
            price: txt.enterprise.price,
            features: [
                txt.everything_pro,
                feats.unlimited_unlocks,
                feats.api_full,
                feats.whitelabel,
                feats.sso,
                feats.account_manager,
                feats.sla
            ],
            notIncluded: [],
            button: txt.enterprise.button,
            variant: "outline"
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4">{txt.badge}</Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                        {txt.title}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {txt.desc}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={`relative flex flex-col ${tier.popular ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 scale-105 z-10' : 'border-border shadow-sm'}`}>
                            {tier.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0">{txt.pro.badge}</Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                                </div>
                                <div className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2 text-sm">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-green-500/10 text-green-600 shrink-0">
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                    {tier.notIncluded.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2 text-sm text-muted-foreground/50">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                                                <X className="h-3 w-3" />
                                            </div>
                                            <span className="line-through">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full ${tier.popular ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25' : ''}`}
                                    variant={tier.variant as any}
                                    asChild
                                >
                                    <Link href="/signup">{tier.button}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
