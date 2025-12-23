"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function LandingHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all group">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 group-hover:scale-125 transition-transform duration-300 ring-1 ring-white/10" />
                    <span className="font-bold text-2xl tracking-tighter text-white">
                        tintel
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Pricing</Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">About</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/candidate/login" className="text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-colors hidden sm:block">
                        For Candidates
                    </Link>
                    <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    <Link href="/login" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors hidden sm:block">
                        Log in
                    </Link>
                    <Button asChild size="sm" className="bg-white text-black hover:bg-white/90 font-semibold">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
