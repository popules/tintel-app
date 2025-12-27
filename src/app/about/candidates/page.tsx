"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Sparkles, Eye, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n-context";

export default function CandidateAboutPage() {
    const { t } = useTranslation();
    const txt = t.about_candidates;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <LandingHeader />

            <main className="pt-32 pb-20">
                <div className="container px-4 md:px-6 mx-auto">
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6"
                        >
                            <Sparkles className="h-3 w-3" />
                            <span>{txt.badge}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                        >
                            {txt.title_1} <br />
                            <span className="text-emerald-400">{txt.title_2}</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
                        >
                            {txt.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button size="lg" className="h-14 px-8 text-lg bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-full shadow-lg shadow-emerald-500/20" asChild>
                                <Link href="/candidate/signup">
                                    {txt.cta}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{txt.cards.card_1_title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {txt.cards.card_1_desc}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                                <Eye className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{txt.cards.card_2_title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {txt.cards.card_2_desc}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{txt.cards.card_3_title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {txt.cards.card_3_desc}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
