"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";

export function LandingHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t, locale, setLocale } = useTranslation();

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'sv' : 'en');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled || mobileMenuOpen ? "bg-[#0f111a] border-b border-white/10 py-3" : "bg-transparent py-5"}`}>
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all group z-50 relative">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20 group-hover:scale-125 transition-transform duration-300 ring-1 ring-white/10" />
                    <span className="font-bold text-2xl tracking-tighter text-white">
                        tintel
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">{t.nav.features}</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">{t.nav.pricing}</Link>
                    <button onClick={toggleLanguage} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-white transition-colors uppercase">
                        <Globe className="h-3 w-3" />
                        {locale}
                    </button>
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Button asChild size="sm" variant="ghost" className="text-white hover:text-white hover:bg-white/10 font-medium h-9 px-4">
                        <Link href="/candidate/login">{t.nav.for_candidates}</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-white text-black hover:bg-white/90 font-bold h-9 px-4 shadow-lg shadow-white/5 transition-all hover:scale-105 active:scale-95">
                        <Link href="/login">{t.nav.for_recruiters}</Link>
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button onClick={toggleLanguage} className="text-sm font-bold text-white uppercase flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {locale}
                    </button>
                    <button
                        className="z-50 p-2 text-white relative"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 pt-24 pb-10 px-6 z-40 bg-[#0f111a] md:hidden flex flex-col gap-6"
                    >
                        <nav className="flex flex-col gap-6">
                            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-white transition-colors">{t.nav.features}</Link>
                            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-muted-foreground hover:text-white transition-colors">{t.nav.pricing}</Link>
                        </nav>

                        <div className="h-px bg-white/10 w-full" />

                        <div className="flex flex-col gap-4">
                            <Button asChild size="lg" variant="secondary" className="w-full font-semibold justify-start bg-white/10 hover:bg-white/20 text-white">
                                <Link href="/candidate/login">{t.nav.for_candidates}</Link>
                            </Button>
                            <Button asChild size="lg" className="w-full bg-white text-black hover:bg-white/90 font-bold justify-start">
                                <Link href="/login">{t.nav.for_recruiters}</Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
