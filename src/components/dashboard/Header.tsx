"use client";

import { Input } from "@/components/ui/input"
import { Search, Bell, User, LayoutDashboard, Database, Send, Settings, LogOut, Kanban, TrendingUp, Building2, RefreshCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
    searchTerm?: string
    setSearchTerm?: (term: string) => void
}

export function Header({ searchTerm = "", setSearchTerm = () => { } }: HeaderProps) {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    const [notifications, setNotifications] = useState<any[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([])
            return
        }
        const timer = setTimeout(async () => {
            setIsSearching(true)
            try {
                const res = await fetch(`/api/companies/search?q=${encodeURIComponent(searchQuery)}`)
                const data = await res.json()
                setSearchResults(data.results || [])
            } finally {
                setIsSearching(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data)

                // Fetch notifications
                fetch('/api/notifications')
                    .then(res => res.json())
                    .then(json => {
                        setNotifications(json.notifications || [])
                        setUnreadCount(json.notifications?.filter((n: any) => !n.is_read).length || 0)
                    })
                    .catch(err => console.error("Notification fetch error", err))
            }
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        setUser(null)
        setProfile(null)
    }

    const markAsRead = async (id: string) => {
        try {
            await fetch('/api/notifications', {
                method: 'POST',
                body: JSON.stringify({ notificationId: id })
            })
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) {
            console.error("Failed to mark as read", err)
        }
    }

    const refreshSignals = async () => {
        setIsSyncing(true)
        try {
            const res = await fetch('/api/analytics/signals')
            const data = await res.json()
            if (data.success) {
                // Fetch notifications again
                const nRes = await fetch('/api/notifications')
                const nData = await nRes.json()
                setNotifications(nData.notifications || [])
                setUnreadCount(nData.notifications?.filter((n: any) => !n.is_read).length || 0)
            }
        } catch (err) {
            console.error("Failed to sync signals", err)
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-xl px-4 md:px-6 h-16 flex items-center justify-between transition-all duration-300">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-all group">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 group-hover:scale-125 transition-transform duration-300 ring-1 ring-white/10" />
                <span className="font-bold text-xl tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    tintel
                </span>
            </Link>

            <div className="flex-1 max-w-xl mx-4 md:mx-8 hidden md:block group relative">
                <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Jump to any company..."
                        className="w-full bg-muted/50 border-transparent pl-10 h-10 rounded-xl focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-2xl overflow-hidden z-50 p-2"
                    >
                        <div className="px-3 py-1.5 mb-1">
                            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Company Results</span>
                        </div>
                        {searchResults.map((res) => (
                            <Link
                                key={res.id}
                                href={`/company/${encodeURIComponent(res.name)}`}
                                onClick={() => {
                                    setSearchQuery("")
                                    setSearchResults([])
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors group"
                            >
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold group-hover:text-indigo-600">{res.name}</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">Market Intelligence • Profile</span>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {user ? (
                    <>
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs font-semibold text-foreground">{profile?.full_name || user.email}</span>
                            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">
                                {profile?.membership_tier === 'admin' || user.email === 'antonaberg@gmail.com' ? 'Admin / Partner' : 'Partner Access'}
                            </span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background animate-pulse" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel className="flex justify-between items-center">
                                    Notifications
                                    {unreadCount > 0 && <Badge variant="secondary" className="text-[10px]">{unreadCount} New</Badge>}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <DropdownMenuItem
                                                key={n.id}
                                                className={`cursor-pointer flex flex-col items-start gap-1 p-3 transition-colors ${!n.is_read ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}
                                                onClick={() => markAsRead(n.id)}
                                            >
                                                <div className="flex w-full justify-between font-medium items-center">
                                                    <span className="flex items-center gap-2 text-sm">
                                                        {n.type === 'signal' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                                                        {n.title}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                        {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                    {n.content}
                                                </p>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs italic">No new signals detected yet.</p>
                                        </div>
                                    )}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer justify-center text-xs text-indigo-500 font-bold hover:bg-indigo-50 p-3"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        refreshSignals();
                                    }}
                                    disabled={isSyncing}
                                >
                                    {isSyncing ? (
                                        <RefreshCcw className="h-3 w-3 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCcw className="h-3 w-3 mr-2" />
                                    )}
                                    {isSyncing ? "Scanning Market..." : "Scan for Signals"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 ring-2 ring-background cursor-pointer flex items-center justify-center text-white font-bold text-xs select-none">
                                    {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/saved" className="flex items-center w-full">
                                        <Kanban className="mr-2 h-4 w-4" />
                                        <span>My Pipeline</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" asChild>
                                    <Link href="/profile" className="flex items-center w-full">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                            <Link href="/signup">Sign up</Link>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}

