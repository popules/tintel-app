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
                            The Operating System <br />
                            <span className="text-indigo-400">for Modern Recruitment.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
                        >
                            Find active needs. Identify the right contact. Send the perfect pitch. All in seconds.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg shadow-indigo-500/20" asChild>
                                <Link href="/signup">
                                    Start Finding Leads
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
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
                            <h3 className="text-xl font-bold mb-3">Smart Lead Gen</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We monitor thousands of job boards to identify companies hiring <i>right now</i>. Know who has budget before your competitors do.
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
                                <LockKeyhole className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Contact Intelligence</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Stop guessing. We identify the actual Hiring Manager and enrich their profile with verified contact details (email & phone).
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
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Personalization</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Our AI analyzes the job ad and company news to draft hyper-personalized outreach emails that get replies.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors border-l-4 border-l-emerald-500"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                                <Search className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-emerald-400">Active Talent Marketplace</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Need to fill a role instantly? Access our curated database of pre-vetted candidates who are ready to move.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
