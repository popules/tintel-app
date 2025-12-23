"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Now live in Sweden
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent"
                >
                    The Talent Intelligence <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Marketplace</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Connecting top active candidates with the best employers. <br className="hidden sm:block" />
                    Stop hunting. Start hiring. Or get found instantly.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <div className="flex flex-col items-center gap-2 group">
                        <Button size="lg" className="h-12 px-8 text-base bg-white text-black hover:bg-white/90 shadow-xl shadow-white/10 w-full sm:w-auto" asChild>
                            <Link href="/about/recruiters">
                                I'm Hiring
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read More</span>
                    </div>

                    <span className="text-muted-foreground text-sm font-medium italic px-2">or</span>

                    <div className="flex flex-col items-center gap-2 group">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 w-full sm:w-auto" asChild>
                            <Link href="/about/candidates">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                I'm Looking for Work
                            </Link>
                        </Button>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read More</span>
                    </div>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-video group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 group-hover:opacity-100 transition-opacity" />

                    {/* Mock UI Elements */}
                    <div className="absolute top-4 left-4 right-4 h-8 bg-white/5 rounded-lg flex items-center justify-between px-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                        </div>
                        <div className="flex items-center gap-1.5 opacity-20">
                            <div className="h-4 w-4 rounded bg-white" />
                            <div className="h-2 w-8 bg-white rounded" />
                        </div>
                    </div>

                    <div className="absolute top-16 left-4 right-4 bottom-4 flex gap-4">
                        {/* Sidebar */}
                        <div className="w-48 bg-white/5 rounded-lg border border-white/5 hidden md:block" />
                        {/* Main Content */}
                        <div className="flex-1 bg-white/5 rounded-lg border border-white/5 flex flex-col gap-4 p-4">
                            <div className="h-32 bg-indigo-500/10 rounded-lg border border-indigo-500/20 w-full animate-pulse" />
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-40 bg-white/5 rounded-lg" />
                                <div className="h-40 bg-white/5 rounded-lg" />
                                <div className="h-40 bg-white/5 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white/20 font-mono text-sm">Interactive Dashboard Preview</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
