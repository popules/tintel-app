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

    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/companies');
                const data = await res.json();
                setCompanies(data.companies || []);
            } catch (err) {
                console.error("Failed to fetch companies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="container mx-auto p-4 md:p-8 space-y-8">
                <header>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Market Intelligence</h1>
                    <p className="text-muted-foreground">Analyzing {companies.length} hiring entities across Scandinavia.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-indigo-500/5 border-indigo-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-indigo-500" />
                                Hiring Momentum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : (companies[0]?.name || "Finding leads...")}</div>
                            <p className="text-xs text-muted-foreground mt-1">{loading ? "Analyzing..." : "Highest volume of recent activity"}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-emerald-500/5 border-emerald-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-emerald-500" />
                                Growth Leader
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : (companies[1]?.name || "Scanning...")}</div>
                            <p className="text-xs text-muted-foreground mt-1">{loading ? "Mapping..." : "Aggressive expansion detected"}</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-amber-500/5 border-amber-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-amber-500" />
                                Strategic Player
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : (companies[2]?.name || "Filtering...")}</div>
                            <p className="text-xs text-muted-foreground mt-1">{loading ? "Verifying..." : "Key entities in focus"}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter companies..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                            ))
                        ) : filteredCompanies.map((company) => (
                            <Link key={company.name} href={`/company/${encodeURIComponent(company.name)}`}>
                                <Card className="hover:bg-muted/50 transition-all cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <Badge variant={company.growth.startsWith('+') ? 'default' : 'secondary'} className={company.growth.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500 border-0' : ''}>
                                                {company.growth}
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-indigo-500 transition-colors flex items-center gap-2">
                                            {company.name}
                                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 font-medium">
                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {company.city}</span>
                                            <span>•</span>
                                            <span>{company.count} Jobs</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
