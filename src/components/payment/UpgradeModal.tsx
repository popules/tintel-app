"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Sparkles, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/billing";
import { toast } from "sonner";

import { useTranslation } from "@/lib/i18n-context";

interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
    const [loading, setLoading] = useState<'refill' | 'pro' | null>(null);
    const { t } = useTranslation();
    const txt = (t as any).upgrade_modal; // Helper for type safety if definitions lag

    const handleCheckout = async (type: 'refill' | 'pro') => {
        setLoading(type);
        try {
            console.log("Initiating checkout for:", type);
            const result = await createCheckoutSession(type);

            if (result.error) {
                console.error("Checkout server error:", result.error);
                toast.error(`Checkout failed: ${result.error}`);
                setLoading(null);
                return;
            }

            if (result.url) {
                console.log("Redirecting to:", result.url);
                toast.success("Redirecting to Stripe...");
                window.location.href = result.url;
            } else {
                console.error("No URL returned");
                toast.error("Error creating checkout session (No URL)");
                setLoading(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Checkout failed due to unexpected error.");
            setLoading(null);
        }
    };

    if (!txt) return null; // Safety check

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl border-0 bg-slate-950 p-0 overflow-hidden ring-1 ring-white/10">
                <div className="grid md:grid-cols-2">
                    {/* Left: Refill Option */}
                    <div className="p-8 border-b md:border-b-0 md:border-r border-white/5 space-y-6 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Zap className="h-5 w-5" />
                                </span>
                                <h3 className="text-xl font-bold text-white">{txt.refill.title}</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {txt.refill.desc}
                            </p>
                        </div>

                        <div className="space-y-4 z-10">
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-blue-500" />
                                    <span>{txt.refill.feature_1}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-blue-500" />
                                    <span>{txt.refill.feature_2}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-blue-500" />
                                    <span>{txt.refill.feature_3}</span>
                                </li>
                            </ul>

                            <div className="pt-4">
                                <div className="text-2xl font-bold text-white mb-4">{txt.refill.price} <span className="text-sm font-normal text-slate-500">{txt.refill.price_sub}</span></div>
                                <Button
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                                    onClick={() => handleCheckout('refill')}
                                    disabled={!!loading}
                                >
                                    {loading === 'refill' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {txt.refill.button}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Pro Subscription */}
                    <div className="p-8 bg-gradient-to-br from-indigo-950/50 to-purple-950/20 space-y-6 flex flex-col justify-between relative overflow-hidden group">

                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />

                        {/* "Most Popular" Badge */}
                        <div className="absolute top-4 right-4 animate-pulse">
                            <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/40">
                                {txt.pro.badge}
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Crown className="h-5 w-5" />
                                </span>
                                <h3 className="text-xl font-bold text-white">{txt.pro.title}</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {txt.pro.desc}
                            </p>
                        </div>

                        <div className="space-y-4 z-10">
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-indigo-500" />
                                    <span className="font-semibold text-white">{txt.pro.feature_1}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-500" />
                                    <span>{txt.pro.feature_2}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-indigo-500" />
                                    <span>{txt.pro.feature_3}</span>
                                </li>
                            </ul>

                            <div className="pt-4">
                                <div className="text-2xl font-bold text-white mb-4">{txt.pro.price} <span className="text-sm font-normal text-slate-500">{txt.pro.price_sub}</span></div>
                                <Button
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0"
                                    onClick={() => handleCheckout('pro')}
                                    disabled={!!loading}
                                >
                                    {loading === 'pro' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {txt.pro.button}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
