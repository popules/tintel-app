"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, CreditCard, Infinity } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { useState } from "react";
import { STRIPE_PLANS } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";

interface PricingModalProps {
    trigger?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PricingModal({ trigger, isOpen, onOpenChange }: PricingModalProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleCheckout = async (planType: 'subscription' | 'credits') => {
        setIsLoading(planType);
        try {
            const plan = planType === 'subscription' ? STRIPE_PLANS.PRO_SUBSCRIPTION : STRIPE_PLANS.CREDIT_PACK;

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: plan.id,
                    planType,
                    creditsAmount: planType === 'credits' ? (plan as any).credits : undefined
                })
            });

            const { url } = await res.json();
            if (url) {
                window.location.href = url;
            } else {
                alert("Something went wrong initiating checkout.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to connect to payment server.");
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-4xl bg-background/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden gap-0">
                <div className="grid md:grid-cols-2">
                    {/* LEFT: Subscription */}
                    <div className="p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-border/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />

                        <div className="mb-4">
                            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 border-none text-white px-3 py-1 text-xs uppercase tracking-widest">
                                Most Popular
                            </Badge>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{STRIPE_PLANS.PRO_SUBSCRIPTION.name}</h3>
                        <div className="text-4xl font-black mb-1">{STRIPE_PLANS.PRO_SUBSCRIPTION.price}</div>
                        <p className="text-sm text-muted-foreground mb-6">per month</p>

                        <ul className="space-y-3 mb-8 text-left w-full max-w-[200px] mx-auto">
                            <li className="flex gap-2 text-sm justify-center">
                                <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                                <span>Unlimited Unlocks</span>
                            </li>
                            <li className="flex gap-2 text-sm justify-center">
                                <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                                <span>Priority Parsing</span>
                            </li>
                            <li className="flex gap-2 text-sm justify-center">
                                <Check className="h-5 w-5 text-indigo-500 shrink-0" />
                                <span>Advanced Filters</span>
                            </li>
                        </ul>

                        <div className="mt-auto w-full">
                            <Button
                                size="lg"
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                                onClick={() => handleCheckout('subscription')}
                                disabled={!!isLoading}
                            >
                                {isLoading === 'subscription' ? "Connecting..." : "Upgrade to Pro"}
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: Credits */}
                    <div className="p-8 flex flex-col items-center text-center bg-muted/20 relative">
                        <div className="mb-8">
                            <div className="h-12 w-12 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{STRIPE_PLANS.CREDIT_PACK.name}</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-4">
                                {STRIPE_PLANS.CREDIT_PACK.description}
                            </p>
                            <div className="text-3xl font-bold">{STRIPE_PLANS.CREDIT_PACK.price}</div>
                        </div>

                        <div className="mt-auto w-full">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full border-2 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all rounded-xl"
                                onClick={() => handleCheckout('credits')}
                                disabled={!!isLoading}
                            >
                                {isLoading === 'credits' ? "Processing..." : "Buy Credit Pack"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
