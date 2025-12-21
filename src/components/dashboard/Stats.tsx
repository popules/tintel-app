import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, Building, TrendingUp, Zap, Loader2 } from "lucide-react"

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
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(json => {
                setData(json)
                setLoading(false)
            })
            .catch(err => {
                console.error("Stats error", err)
                setLoading(false)
            })
    }, [])

    const stats = [
        {
            title: "Market Depth",
            value: loading ? "..." : (data?.totalJobs?.toLocaleString() || "0"),
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            label: "Total analyzed"
        },
        {
            title: "Active Openings",
            value: loading ? "..." : (data?.activeJobs?.toLocaleString() || "0"),
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            label: "Last 30 days"
        },
        {
            title: "Active Companies",
            value: loading ? "..." : (data?.activeCompanies?.toLocaleString() || "0"),
            icon: Building,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            label: "Unique entities"
        },
        {
            title: "New Leads",
            value: loading ? "..." : data?.newLeads || "0",
            icon: Users,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            label: "Personalized"
        },
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
                    <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all cursor-default overflow-hidden group border border-white/5">
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                {loading ? <Loader2 className={`h-4 w-4 animate-spin ${stat.color}`} /> : <stat.icon className={`h-4 w-4 ${stat.color}`} />}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold opacity-70">
                                {stat.label}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    )
}
