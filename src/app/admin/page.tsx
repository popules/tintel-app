"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/app/actions/admin";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, Unlock, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load admin stats", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto py-12 px-4 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        <p className="text-sm text-muted-foreground font-medium">Entering God Mode...</p>
                    </div>
                </main>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            description: "Total registered accounts",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Candidates",
            value: stats?.candidates || 0,
            icon: ArrowUpRight,
            description: "Talent supply",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Recruiters",
            value: stats?.recruiters || 0,
            icon: CreditCard,
            description: "Market demand",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Recent Signups",
            value: stats?.recentUsers?.length || 0,
            icon: TrendingUp,
            description: "Last 24-48 hours",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto py-12 px-4 space-y-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                        God Mode
                        <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500 text-white px-2 py-0.5 rounded">Admin</span>
                    </h1>
                    <p className="text-muted-foreground">Marketplace overview and governance dashboard.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-white/5 bg-white/5 backdrop-blur-sm hover:border-white/10 transition-all cursor-default group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                                        {card.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                                        <card.icon className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{card.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {card.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Users Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-white/5 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-wider">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {stats?.recentUsers?.map((u: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                {u.full_name?.[0] || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{u.full_name || 'Anonymous'}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded ${u.role === 'candidate' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                        {u.role}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">Joined {new Date(u.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
                                            Manage
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-wider">System Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs">
                                <p className="font-bold flex items-center gap-2 mb-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Growth Spotted
                                </p>
                                <p className="opacity-80">Recruiter signup rate is up 12% today compared to last week.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
