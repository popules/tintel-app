"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BrainCircuit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { chatWithOracle } from "@/app/actions/oracle";
import { useTranslation } from "@/lib/i18n-context";
import { UpgradeModal } from "@/components/payment/UpgradeModal";

interface OracleInterfaceProps {
    sessionId: string;
    marketContext: any;
    initialCredits?: number;
    onClose: () => void;
}

const translateSignal = (label: string) => {
    const map: Record<string, string> = {
        "Aggressive Hirer": "Aggressiv Rekrytering",
        "Active Hirer": "Aktiv Rekrytering",
        "Leaker": "Personalbortfall",
        "Neutral": "Neutral",
        "Stable": "Stabil"
    };
    return map[label] || label;
};

export function OracleInterface({ sessionId, marketContext, initialCredits = 0, onClose }: OracleInterfaceProps) {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [credits, setCredits] = useState(initialCredits);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Greeting
    useEffect(() => {
        setMessages([{
            role: 'assistant',
            content: `Hej. Jag är Oraklet. Jag har analyserat marknadsdatan för denna roll.
            
Löneestimat: ${marketContext.salary_min || '?'} - ${marketContext.salary_max || '?'} ${marketContext.salary_currency || 'SEK'}
Rekryteringssignal: ${translateSignal(marketContext.signal_label)} (${marketContext.hiring_velocity > 0 ? '+' : ''}${Math.round(marketContext.hiring_velocity * 100)}% aktivitet)

Jag är här för att maximera dina chanser. Berätta, vad gör dig till den anomali marknaden behöver?`
        }]);
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Optimistic check (though server is authority)
        if (credits <= 0) {
            setShowUpgrade(true);
            return;
        }

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        const result = await chatWithOracle(sessionId, userMsg);

        setLoading(false);
        if (result.success) {
            setMessages(prev => [...prev, { role: 'assistant', content: result.message }]);
            setCredits(prev => Math.max(0, prev - 1)); // Decrement locally
        } else if (result.error === 'insufficient_credits') {
            setShowUpgrade(true);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "⚠️ Slut på krediter. Vänligen fyll på för att fortsätta."
            }]);
        }
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl h-[600px] bg-slate-950 border border-indigo-500/30 rounded-2xl shadow-2xl flex overflow-hidden ring-1 ring-indigo-500/50"
            >
                {/* Sidebar - Context */}
                <div className="w-64 bg-slate-900/50 p-6 border-r border-indigo-500/20 hidden md:block">
                    <div className="flex items-center gap-2 text-indigo-400 mb-8">
                        <BrainCircuit className="w-6 h-6" />
                        <span className="font-bold tracking-wider">TINTEL ORACLE</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Marknadslön</p>
                            <p className="text-xl font-mono text-white">
                                {marketContext.salary_min ? `${marketContext.salary_min / 1000}k` : '?'} - {marketContext.salary_max ? `${marketContext.salary_max / 1000}k` : '?'}
                            </p>
                            <p className="text-xs text-indigo-400/80">{marketContext.salary_currency}</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Konkurrens</p>
                            <div className="flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ${marketContext.hiring_velocity > 0 ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                <p className="text-sm font-medium text-slate-200">{translateSignal(marketContext.signal_label)}</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-800">
                            <p className="text-xs leading-relaxed text-slate-400">
                                "Jag gissar inte. Jag beräknar."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-950 to-slate-900 relative">
                    {/* Header */}
                    <div className="h-14 border-b border-indigo-500/10 flex items-center justify-between px-6">
                        <span className="text-xs font-mono text-indigo-500/60 animate-pulse">● DIREKTANSLUTNING</span>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowUpgrade(true)}
                                className={`h-8 text-xs font-medium border ${credits > 0 ? 'border-indigo-500/20 text-indigo-400' : 'border-red-500/50 text-red-500 bg-red-500/10'}`}
                            >
                                <Sparkles className="w-3 h-3 mr-1.5" />
                                {credits} Krediter {credits === 0 && "(Fyll på)"}
                            </Button>

                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-800 text-slate-400">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                                    }`}>
                                    <p className="whitespace-pre-line">{m.content}</p>
                                </div>
                            </motion.div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-sm border border-slate-700/50 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                                    <span className="text-xs text-indigo-300">Beräknar...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-indigo-500/10 bg-slate-950/50">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Fråga Oraklet..."
                                className="bg-slate-900 border-slate-800 focus-visible:ring-indigo-500/50 text-slate-200"
                            />
                            <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
        </div>
    );
}
