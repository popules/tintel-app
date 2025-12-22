"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Users, ArrowUpRight, Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [range, setRange] = useState("30d");
    const [category, setCategory] = useState("All");
    const [location, setLocation] = useState("All");
    const supabase = createClient();

    // 1. Fetch user preference for default location
    useEffect(() => {
        const fetchUserPref = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('home_city')
                    .eq('id', user.id)
                    .single();
                if (data?.home_city) {
                    setLocation(data.home_city);
                }
            }
        };
        fetchUserPref();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/market/top-players?range=${range}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`);
                const data = await res.json();
                setCompanies(data.players || []);
            } catch (err) {
                console.error("Failed to fetch companies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [range, category, location]);

    const categories = [
        "All",
        "Data/IT",
        "Hälso- och sjukvård",
        "Pedagogik",
        "Bygg och anläggning",
        "Försäljning, inköp, marknadsföring",
        "Administration, ekonomi, juridik",
        "Chefer och verksamhetsledare",
        "Installation, drift, underhåll",
        "Industriell tillverkning",
        "Yrken med teknisk inriktning",
        "Social inriktning"
    ];

    const locations = [
        "All",
        "Stockholm",
        "Göteborg",
        "Malmö",
        "Uppsala",
        "Linköping",
        "Västerås",
        "Örebro",
        "Umeå",
        "Helsingborg"
    ];

    const ranges = [
        { id: "30d", label: "Live (30d)" },
        { id: "Q4", label: "Q4 2024" },
        { id: "Q3", label: "Q3 2024" },
        { id: "2024", label: "Year 2024" }
    ];

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">Market Intelligence</h1>
                        <p className="text-muted-foreground">Comparative benchmarking across Scandinavia's top hiring entities.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6 bg-muted/30 p-6 rounded-2xl border border-muted ring-1 ring-white/5">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex bg-background p-1 rounded-xl border border-muted shadow-sm">
                            {ranges.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setRange(r.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${range === r.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-muted font-bold text-muted-foreground'}`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <div className="h-8 w-px bg-muted hidden lg:block" />

                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Location:</span>
                            <div className="flex gap-2">
                                {Array.from(new Set([...locations, location])).map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => setLocation(loc)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${location === loc ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' : 'bg-background border-muted hover:border-indigo-500/50 text-muted-foreground'}`}
                                    >
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-muted/50" />

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap">Vertical:</span>
                        <div className="flex gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${category === cat ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-background border-muted hover:border-indigo-500/50 text-muted-foreground'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse border border-muted/50" />
                        ))
                    ) : (
                        filteredCompanies.map((company, idx) => (
                            <Link key={company.name} href={`/company/${encodeURIComponent(company.name)}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.02 }}
                                >
                                    <Card className="hover:bg-indigo-500/[0.02] hover:border-indigo-500/30 transition-all cursor-pointer group h-full relative overflow-hidden bg-background/50 backdrop-blur-sm shadow-sm ring-1 ring-white/5">
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                                    <span className="font-bold">{idx + 1}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black tracking-tight">{company.volume}</div>
                                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Total Ads</div>
                                                </div>
                                            </div>

                                            <h3 className="text-base font-bold truncate group-hover:text-indigo-500 transition-colors mb-2">
                                                {company.name}
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[10px] text-muted-foreground uppercase font-black">Lead Domain</div>
                                                    <div className="text-xs font-semibold truncate max-w-full text-indigo-600/80 bg-indigo-500/5 p-1 px-2 rounded-md border border-indigo-500/10">
                                                        {company.topCategory}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-xs pt-2 border-t border-muted/50">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Users className="h-3 w-3" />
                                                        <span>{Math.round((company.topCategoryVolume / company.volume) * 100)}% Focus</span>
                                                    </div>
                                                    <div className="text-emerald-500 font-bold flex items-center gap-0.5">
                                                        <TrendingUp className="h-3 w-3" />
                                                        {company.growth}%
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
