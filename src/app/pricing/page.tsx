import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    const tiers = [
        {
            name: "Starter",
            description: "For independent recruiters and small teams.",
            price: "Free",
            features: [
                "Unlimited Job Search",
                "5 Lead Unlocks / month",
                "Basic Kanban Board",
                "Community Support",
                "Standard Speed"
            ],
            notIncluded: [
                "AI Pitch Generator",
                "Smart Search (Vector)",
                "Team Collaboration",
                "API Access"
            ],
            button: "Get Started",
            variant: "outline"
        },
        {
            name: "Pro",
            description: "For power users who need AI superpowers.",
            price: "1999 SEK",
            period: "/ month",
            popular: true,
            features: [
                "Everything in Starter",
                "500 Lead Unlocks / month",
                "AI Pitch Generator (Unlimited)",
                "Smart Search (Vector Matching)",
                "Find Lead Detective (AI)",
                "Priority Support"
            ],
            notIncluded: [
                "White-labeling",
                "Dedicated Account Manager"
            ],
            button: "Upgrade to Pro",
            variant: "default"
        },
        {
            name: "Enterprise",
            description: "For agencies requiring scale and custom integrations.",
            price: "Custom",
            features: [
                "Everything in Pro",
                "Unlimited Lead Unlocks",
                "API Access (JobTech + Internal)",
                "White-labeling",
                "SSO / SAML",
                "Dedicated Account Manager",
                "SLA Guarantee"
            ],
            notIncluded: [],
            button: "Contact Sales",
            variant: "outline"
        }
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4">Simple Pricing</Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                        Invest in intelligence
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Choose the plan that fits your recruitment needs. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={`relative flex flex-col ${tier.popular ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 scale-105 z-10' : 'border-border shadow-sm'}`}>
                            {tier.popular && (
                                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0">Most Popular</Badge>
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
