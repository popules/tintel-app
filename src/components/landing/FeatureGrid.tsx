"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Search, Magnet, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n-context";

export function FeatureGrid() {
    const { t } = useTranslation();

    return (
        <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto" id="features">
            <div className="text-center mb-16 space-y-4">
                <Badge variant="outline" className="px-4 py-1 border-indigo-500/30 text-indigo-400 bg-indigo-950/10">
                    Why Tintel?
                </Badge>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                    {t.features.title} <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t.features.subtitle}</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t.landing.desc}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">

                {/* Large Left Item: Candidate Value */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="md:col-span-2 row-span-2 bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 bg-indigo-500/20 blur-3xl rounded-full translate-x-12 -translate-y-12" />

                    <div className="space-y-4 relative z-10">
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold">{t.features.card_1_title}</h3>
                        <p className="text-muted-foreground text-lg">
                            {t.features.card_1_desc}
                        </p>
                    </div>

                    {/* Visual Representation of Parsing */}
                    <div className="mt-8 relative h-48 w-full bg-black/40 rounded-xl border border-white/5 p-4 overflow-hidden">
                        <div className="flex gap-4 items-center mb-4 opacity-50">
                            <FileText className="h-8 w-8 text-gray-400" />
                            <div className="h-2 w-24 bg-gray-600 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-8 w-3/4 bg-indigo-500/20 rounded-lg animate-pulse" />
                            <div className="h-8 w-1/2 bg-purple-500/20 rounded-lg animate-pulse delay-75" />
                            <div className="h-8 w-5/6 bg-green-500/20 rounded-lg animate-pulse delay-150" />
                        </div>
                        <div className="absolute right-4 bottom-4">
                            <Badge className="bg-green-500 text-black font-bold animate-bounce">Parsed!</Badge>
                        </div>
                    </div>
                </motion.div>

                {/* Top Right: Recruiter Value */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full" />
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Magnet className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg">{t.features.card_3_title}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {t.features.card_3_desc}
                        </p>
                    </div>
                </motion.div>

                {/* Bottom Right: Trust/Security */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden"
                >
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Shield className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg">{t.features.card_4_title}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {t.features.card_4_desc}
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
