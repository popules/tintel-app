"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n-context";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();
    const txt = t.footer;

    useEffect(() => {
        const consent = localStorage.getItem("tintel_cookie_consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("tintel_cookie_consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("tintel_cookie_consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
                >
                    <div className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 bg-indigo-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-indigo-500/10 transition-colors" />

                        <div className="flex items-start gap-4 relative">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <Cookie className="h-5 w-5" />
                            </div>
                            <div className="space-y-3">
                                <div className="pt-1">
                                    <h4 className="font-bold text-foreground text-sm">{txt.cookie_title}</h4>
                                    <p className="text-xs leading-relaxed text-muted-foreground mt-1">
                                        {txt.cookie_msg}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Button
                                        onClick={handleAccept}
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-lg shadow-lg shadow-indigo-500/20"
                                    >
                                        {txt.cookie_accept}
                                    </Button>
                                    <Button
                                        onClick={handleDecline}
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-white/5"
                                    >
                                        {txt.cookie_settings}
                                    </Button>
                                </div>
                                <div className="pt-1">
                                    <Link
                                        href="/privacy"
                                        className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60 hover:text-indigo-400 transition-colors"
                                    >
                                        {txt.cookie_privacy}
                                    </Link>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-0 right-0 text-muted-foreground/40 hover:text-foreground transition-colors p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
