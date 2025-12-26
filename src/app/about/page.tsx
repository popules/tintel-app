"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Globe, Zap, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n-context";

export default function AboutPage() {
    const { t } = useTranslation();
    const txt = t.public.about;

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                <div className="container px-4 mx-auto text-center relative z-10">
                    <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50">{txt.mission_badge}</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
                        {txt.mission_title}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        {txt.mission_desc}
                    </p>
                </div>
            </section>

            {/* Gothenburg Section */}
            <section className="py-20 bg-muted/30 border-y border-border/50">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-3 md:skew-y-0 rotate-2 transition-transform hover:rotate-0">
                            {/* Placeholder for Gbg Image - using a gradient for now */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                                <span className="text-9xl opacity-20 select-none">🇸🇪</span>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                                <p className="font-semibold">{txt.gbg_badge}</p>
                                <p className="text-xs opacity-80">{txt.gbg_coords}</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">{txt.gbg_title} <br /><span className="text-indigo-600">{txt.gbg_subtitle}</span></h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {txt.gbg_desc}
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex flex-col gap-2 p-4 bg-background rounded-lg border shadow-sm">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    <span className="font-semibold">{txt.value_craft_title}</span>
                                    <span className="text-xs text-muted-foreground">{txt.value_craft_desc}</span>
                                </div>
                                <div className="flex flex-col gap-2 p-4 bg-background rounded-lg border shadow-sm">
                                    <Globe className="h-5 w-5 text-indigo-500" />
                                    <span className="font-semibold">{txt.value_global_title}</span>
                                    <span className="text-xs text-muted-foreground">{txt.value_global_desc}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-16">{txt.why_title}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{txt.value_speed_title}</h3>
                            <p className="text-muted-foreground">{txt.value_speed_desc}</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{txt.value_people_title}</h3>
                            <p className="text-muted-foreground">{txt.value_people_desc}</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{txt.value_open_title}</h3>
                            <p className="text-muted-foreground">{txt.value_open_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-indigo-600 text-white text-center">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl font-bold mb-6">{txt.cta_title}</h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                        {txt.cta_desc}
                    </p>
                    <Button size="lg" variant="secondary" asChild className="font-semibold">
                        <Link href="/signup">{txt.cta_button}</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
