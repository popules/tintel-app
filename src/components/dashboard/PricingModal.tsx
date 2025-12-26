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
                <div className="flex flex-col items-center justify-center p-8 text-center bg-background relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
                    <div className="absolute bottom-0 left-0 p-32 bg-purple-500/5 blur-3xl rounded-full -translate-x-12 translate-y-12" />

                    <div className="mb-6 z-10">
                        <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 border-none text-white px-4 py-1.5 text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                            Unlimited Access
                        </Badge>
                    </div>

                    <h3 className="text-3xl font-bold mb-2 z-10">Tintel Pro</h3>
                    <div className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70 z-10">
                        {STRIPE_PLANS.PRO_SUBSCRIPTION.price}
                    </div>
                    <p className="text-sm text-muted-foreground mb-8 z-10">per month</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-10 w-full max-w-lg z-10">
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <Check className="h-4 w-4 text-indigo-500" />
                            </div>
                            <span className="font-medium">Unlimited Candidate Unlocks</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <Sparkles className="h-4 w-4 text-indigo-500" />
                            </div>
                            <span className="font-medium">Priority AI Matching</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <Infinity className="h-4 w-4 text-indigo-500" />
                            </div>
                            <span className="font-medium">Full Contact Details</span>
                        </div>
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <CreditCard className="h-4 w-4 text-indigo-500" />
                            </div>
                            <span className="font-medium">Cancel Anytime</span>
                        </div>
                    </div>

                    <div className="w-full max-w-xs z-10">
                        <Button
                            size="lg"
                            className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
                            onClick={() => handleCheckout('subscription')}
                            disabled={!!isLoading}
                        >
                            {isLoading === 'subscription' ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span> Connecting...
                                </span>
                            ) : (
                                "Upgrade to Pro"
                            )}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-4">
                            Secure payment via Stripe. 14-day money-back guarantee.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
