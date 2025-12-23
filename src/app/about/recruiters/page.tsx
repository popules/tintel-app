"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Search, BarChart3, LockKeyhole, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RecruiterAboutPage() {
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
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6"
                        >
                            <Search className="h-3 w-3" />
                            <span>For Recruiters</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                        >
                            Stop searching. <br />
                            <span className="text-indigo-400">Start closing.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
                        >
                            Access a curated marketplace of top active candidates who are actually looking for work right now.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg shadow-indigo-500/20" asChild>
                                <Link href="/signup">
                                    Start Finding Talent
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
                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Direct Access</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Bypass the noise of LinkedIn. Search our database of candidates who have explicitly raised their hand for new opportunities.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-6">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Market Intelligence</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Understand the talent landscape with real-time data on supply, demand, and salary trends in your specific region.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6">
                                <LockKeyhole className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Verify & Unlock</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Preview profiles anonymously. Only pay when you find a perfect match and want to unlock contact details.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
