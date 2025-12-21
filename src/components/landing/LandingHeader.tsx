"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Radar } from "lucide-react";
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
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 p-1.5 shadow-lg shadow-indigo-500/20">
                        <Radar className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">
                        tintel
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Pricing</Link>
                    <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">About</Link>
                </nav>

                <div className="flex items-center gap-4">
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
