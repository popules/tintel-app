"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/billing";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n-context";
import Link from "next/link";

export default function CandidateBillingPage() {
    const [loading, setLoading] = useState<'refill' | 'pro' | null>(null);
    const { t } = useTranslation();
    const txt = (t as any).upgrade_modal;

    const handleCheckout = async (type: 'refill' | 'pro') => {
        setLoading(type);
        try {
            const result = await createCheckoutSession(type, '/candidate/billing');

            if (result.error) {
                toast.error(`Checkout failed: ${result.error}`);
                setLoading(null);
                return;
            }

            if (result.url) {
                toast.success("Redirecting to Stripe...");
                window.location.href = result.url;
            } else {
                toast.error("Error creating checkout session (No URL)");
                setLoading(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Checkout failed due to unexpected error.");
            setLoading(null);
        }
    };

    if (!txt) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" asChild className="text-slate-400 hover:text-white pl-0">
                        <Link href="/candidate/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t.dashboard.dashboard}
                        </Link>
                    </Button>
                </div>

                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t.dashboard.billing}</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        {t.public.pricing.desc}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border border-white/10 rounded-3xl overflow-hidden bg-slate-900/50 backdrop-blur-sm shadow-2xl">
                    {/* Left: Refill Option */}
                    <div className="p-8 md:border-r border-white/5 space-y-6 flex flex-col justify-between relative overflow-hidden group hover:bg-slate-900/80 transition-colors">
                        <div className="absolute top-0 right-0 p-40 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                    <Zap className="h-6 w-6" />
                                </span>
                                <h3 className="text-2xl font-bold">{txt.refill.title}</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                {txt.refill.desc}
                            </p>
                        </div>

                        <div className="space-y-6 z-10">
                            <div className="pt-4 border-t border-white/5">
                                <div className="text-4xl font-bold text-white mb-6">{txt.refill.price} <span className="text-base font-normal text-slate-500">{txt.refill.price_sub}</span></div>
                                <Button
                                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 h-12 text-lg rounded-xl"
                                    onClick={() => handleCheckout('refill')}
                                    disabled={!!loading}
                                >
                                    {loading === 'refill' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    {txt.refill.button}
                                </Button>
                            </div>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-blue-500" />
                                    <span>{txt.refill.feature_1}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-blue-500" />
                                    <span>{txt.refill.feature_2}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-blue-500" />
                                    <span>{txt.refill.feature_3}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Pro Subscription */}
                    <div className="p-8 bg-gradient-to-br from-indigo-950/30 to-purple-950/10 space-y-6 flex flex-col justify-between relative overflow-hidden group hover:from-indigo-950/50 hover:to-purple-950/20 transition-all">
                        <div className="absolute top-0 right-0 p-40 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />

                        {/* "Most Popular" Badge */}
                        <div className="absolute top-6 right-6">
                            <span className="px-4 py-1.5 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/40 animate-pulse">
                                {txt.pro.badge}
                            </span>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <Crown className="h-6 w-6" />
                                </span>
                                <h3 className="text-2xl font-bold">{txt.pro.title}</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                {txt.pro.desc}
                            </p>
                        </div>

                        <div className="space-y-6 z-10">
                            <div className="pt-4 border-t border-white/5">
                                <div className="text-4xl font-bold text-white mb-6">{txt.pro.price} <span className="text-base font-normal text-slate-500">{txt.pro.price_sub}</span></div>
                                <Button
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 border-0 h-12 text-lg rounded-xl"
                                    onClick={() => handleCheckout('pro')}
                                    disabled={!!loading}
                                >
                                    {loading === 'pro' && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    {txt.pro.button}
                                </Button>
                            </div>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-3">
                                    <Sparkles className="h-5 w-5 text-indigo-500" />
                                    <span className="font-semibold text-white">{txt.pro.feature_1}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-indigo-500" />
                                    <span>{txt.pro.feature_2}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-indigo-500" />
                                    <span>{txt.pro.feature_3}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
