"use client";

import { Input } from "@/components/ui/input"
import { Search, Bell, Radar, LogOut, User, Kanban } from "lucide-react"
import { Button } from "@/components/ui/button"
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

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data)
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

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-xl px-4 md:px-6 h-16 flex items-center justify-between transition-all duration-300">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-all group">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-2 group-hover:rotate-6 transition-transform duration-300">
                    <Sparkles className="h-4 w-4 text-white fill-white/20" />
                </div>
                <span className="font-bold text-xl tracking-tighter bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    tintel
                </span>
            </Link>

            <div className="flex-1 max-w-xl mx-4 md:mx-8 hidden md:block group">
                <div className="relative transition-all duration-300 focus-within:scale-[1.02]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search thousands of active job opportunities..."
                        className="w-full bg-muted/50 border-transparent pl-10 h-10 rounded-xl focus:bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {user ? (
                    <>
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs font-semibold text-foreground">{profile?.full_name || user.email}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{profile?.membership_tier || "Free"} Account</span>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-background animate-pulse" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-[300px] overflow-y-auto">
                                    <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-3 bg-muted/30">
                                        <div className="flex w-full justify-between font-medium">
                                            <span>Welcome to Tintel!</span>
                                            <span className="text-[10px] text-muted-foreground">Just now</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            Start finding your next client or career move today. Complete your profile to get noticed.
                                        </p>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-3">
                                        <div className="flex w-full justify-between font-medium">
                                            <span>Profile Completed</span>
                                            <span className="text-[10px] text-muted-foreground">2m ago</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            You've reached the Scout rank level!
                                        </p>
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer justify-center text-xs text-muted-foreground">
                                    View all notifications
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

