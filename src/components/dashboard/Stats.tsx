"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, Building, TrendingUp, Zap } from "lucide-react"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export function StatsRow() {
    const stats = [
        { title: "Total Jobs", value: "2,450", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", change: "+12%" },
        { title: "Active Companies", value: "128", icon: Building, color: "text-indigo-500", bg: "bg-indigo-500/10", change: "+4%" },
        { title: "New Leads", value: "45", icon: Users, color: "text-rose-500", bg: "bg-rose-500/10", change: "+8%" },
        { title: "Outreach Success", value: "85%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "+2.5%" },
    ]

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
            {stats.map((stat, i) => (
                <motion.div key={i} variants={item}>
                    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all cursor-default overflow-hidden group">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-emerald-500 font-medium">{stat.change}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    )
}
