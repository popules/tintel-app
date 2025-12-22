"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/dashboard/Header";
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

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/market/top-players?range=${range}&category=${category}`);
                const data = await res.json();
                setCompanies(data.players || []);
            } catch (err) {
                console.error("Failed to fetch companies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [range, category]);

    const categories = ["All", "Data/IT", "Bygg och anläggning", "Chefer och verksamhetsledare", "Försäljning, inköp, marknadsföring", "Hälso- och sjukvård"];
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
                        <Badge variant="outline" className="mb-2 border-indigo-500/30 text-indigo-500">Market Intelligence 2.0</Badge>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">Swedish Market Trends</h1>
                        <p className="text-muted-foreground">Comparative benchmarking across {companies.length} major entities.</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-muted">
                    <div className="flex bg-background p-1 rounded-xl border border-muted">
                        {ranges.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRange(r.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${range === r.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-muted'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-muted hidden md:block" />

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Category:</span>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${category === cat ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' : 'border-muted hover:border-indigo-500/50'}`}
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
                                    <Card className="hover:bg-indigo-500/[0.02] hover:border-indigo-500/30 transition-all cursor-pointer group h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-5">
                                            <Building2 className="h-12 w-12" />
                                        </div>
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
