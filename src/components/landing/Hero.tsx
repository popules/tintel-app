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
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Platform</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Automate your lead gen. Personalize your outreach. Find your future.
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
                    className="mt-20 relative mx-auto max-w-6xl rounded-xl border border-white/10 bg-[#0f111a] shadow-2xl overflow-hidden aspect-[16/10] group text-left font-sans"
                >
                    {/* Browser Toolbar Mock */}
                    <div className="absolute top-0 left-0 right-0 h-10 bg-[#1a1d2d] border-b border-white/5 flex items-center px-4 gap-4 z-20">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                        <div className="flex-1 max-w-xl mx-auto h-6 bg-[#0f111a]/50 rounded-md border border-white/5 flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                            tintel.se/dashboard
                        </div>
                    </div>

                    {/* Main Interface */}
                    <div className="absolute top-10 inset-0 p-6 flex gap-6 overflow-hidden">

                        {/* Sidebar Mock */}
                        <div className="w-60 flex-shrink-0 flex flex-col gap-6 hidden md:flex">
                            <div className="h-8 w-24 bg-indigo-500/10 rounded mb-4" />

                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-indigo-400/20" /> Find Jobs
                                </div>
                                <div className="p-3 rounded-lg hover:bg-white/5 text-muted-foreground text-sm font-medium flex items-center gap-3">
                                    <div className="w-4 h-4 rounded bg-white/10" /> Find People
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Filters</div>
                                <div className="h-4 w-3/4 bg-white/5 rounded" />
                                <div className="h-4 w-1/2 bg-white/5 rounded" />
                                <div className="h-4 w-2/3 bg-white/5 rounded" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex flex-col gap-6">

                            {/* KPI Cards */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-[#1a1d2d] border border-white/5 rounded-lg p-4 relative overflow-hidden">
                                    <div className="text-xs text-muted-foreground mb-1">Market Depth</div>
                                    <div className="text-2xl font-bold text-white">49 242</div>
                                    <div className="absolute top-4 right-4 text-yellow-500 mb-1">⚡</div>
                                </div>
                                <div className="bg-[#1a1d2d] border border-white/5 rounded-lg p-4 relative overflow-hidden">
                                    <div className="text-xs text-muted-foreground mb-1">Active Openings</div>
                                    <div className="text-2xl font-bold text-emerald-400">13 962</div>
                                    <div className="absolute top-4 right-4 text-emerald-500/20 p-1 rounded">📈</div>
                                </div>
                                <div className="bg-[#1a1d2d] border border-white/5 rounded-lg p-4 hidden lg:block">
                                    <div className="text-xs text-muted-foreground mb-1">Active Companies</div>
                                    <div className="text-2xl font-bold text-white">514</div>
                                </div>
                                <div className="bg-[#1a1d2d] border border-white/5 rounded-lg p-4 hidden lg:block">
                                    <div className="text-xs text-muted-foreground mb-1">New Leads</div>
                                    <div className="text-2xl font-bold text-white">12</div>
                                </div>
                            </div>

                            {/* Job Grid */}
                            <div className="flex-1">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Active Jobs</h3>
                                        <p className="text-sm text-muted-foreground">Find your next client or carrier move.</p>
                                    </div>
                                    <div className="text-xs bg-white/10 px-2 py-1 rounded text-white">100 matches</div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Card 1 - Focused */}
                                    <div className="bg-[#1e2235] border border-indigo-500/30 rounded-xl p-5 shadow-2xl shadow-indigo-500/10 relative group-hover:-translate-y-1 transition-transform duration-500">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-1">New</div>
                                                <div className="font-bold text-white text-lg leading-tight">Senior Frontend Developer</div>
                                                <div className="text-sm text-muted-foreground mt-1">Tech Giant AB</div>
                                            </div>
                                        </div>

                                        {/* The "Found Lead" Magic Moment */}
                                        <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">MJ</div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">Marie Johansson</div>
                                                    <div className="text-[10px] text-indigo-300">Engineering Manager</div>
                                                </div>
                                            </div>
                                            <div className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold">Direct Contact</div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            <div className="h-9 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-xs font-medium text-white/50">Save</div>
                                            <div className="h-9 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20">Draft Pitch ✨</div>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="bg-[#1a1d2d] border border-white/5 rounded-xl p-5 opacity-60 blur-[1px]">
                                        <div className="mb-4">
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Full-time</div>
                                            <div className="font-bold text-white text-lg">Product Designer</div>
                                            <div className="text-sm text-muted-foreground mt-1">Creative Agency</div>
                                        </div>
                                        <div className="mt-8 grid grid-cols-2 gap-2">
                                            <div className="h-9 rounded-md bg-white/5" />
                                            <div className="h-9 rounded-md bg-indigo-500/20" />
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="bg-[#1a1d2d] border border-white/5 rounded-xl p-5 opacity-40 blur-[2px]">
                                        <div className="mb-4">
                                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Remote</div>
                                            <div className="font-bold text-white text-lg">Backend Engineer</div>
                                            <div className="text-sm text-muted-foreground mt-1">Fintech Corp</div>
                                        </div>
                                        <div className="mt-8 grid grid-cols-2 gap-2">
                                            <div className="h-9 rounded-md bg-white/5" />
                                            <div className="h-9 rounded-md bg-indigo-500/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overlay Gradient for "Fold" feeling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}
