"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Building2, Users2, Rocket, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
            <LandingHeader />

            <main className="pt-32 pb-20">
                <div className="container px-4 md:px-6 mx-auto">
                    {/* Hero Section */}
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-6"
                        >
                            Born in Gothenburg. <br />
                            <span className="text-indigo-400">Built for the world.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-muted-foreground leading-relaxed"
                        >
                            Tintel started with a simple observation: modern recruitment is drowning in data but starving for intelligence. We're here to change that.
                        </motion.p>
                    </div>

                    {/* Story Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                We believe that the best recruiters shouldn't spend their time digging through spreadsheets or hunting for email addresses. They should be doing what they do best: building relationships.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Tintel provides the "Intelligence Layer" that sits between you and the market. We automate the discovery and enrichment phase, so you can focus on the human side of hiring.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Local</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
                                        <Users2 className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Diverse</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-2">
                                        <Rocket className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fast</span>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/10 p-1"
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-3xl opacity-20 grayscale brightness-50" />
                            <div className="relative h-full w-full flex items-center justify-center">
                                <div className="text-center p-8 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                                    <p className="text-indigo-400 font-mono text-sm mb-2">EST. 2025</p>
                                    <p className="text-2xl font-bold">Made with <Heart className="inline h-5 w-5 text-pink-500 mx-1 fill-pink-500 animate-pulse" /> in Gothenburg</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Callout */}
                    <div className="text-center max-w-2xl mx-auto py-20 border-t border-white/5">
                        <h2 className="text-3xl font-bold mb-6">Let's build together</h2>
                        <p className="text-muted-foreground mb-10">
                            Whether you're a solo recruiter or an enterprise firm, we'd love to hear from you.
                            Our team is always looking for feedback to make Tintel better.
                        </p>
                        <a
                            href="mailto:hello@tintel.se"
                            className="inline-flex items-center justify-center px-8 h-14 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-95"
                        >
                            Contact hello@tintel.se
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
