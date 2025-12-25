"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function BillingSimulator() {
    const [status, setStatus] = useState("Idle");
    const supabase = createClient();

    const simulateSubscription = async () => {
        setStatus("Simulating Subscription...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setStatus("No User Found");

        // Manually update DB (This simulates what the Webhook does)
        const { error } = await supabase
            .from('profiles')
            .update({
                subscription_tier: 'pro',
                subscription_status: 'active'
            })
            .eq('id', user.id);

        if (error) setStatus("Error: " + error.message);
        else setStatus("Success: User is now PRO!");
    };

    const simulateCredits = async () => {
        setStatus("Adding 10 Credits...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setStatus("No User Found");

        // 1. Get current
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
        const current = profile?.credits || 0;

        // 2. Update
        const { error } = await supabase
            .from('profiles')
            .update({ credits: current + 10 })
            .eq('id', user.id);

        if (error) setStatus("Error: " + error.message);
        else setStatus(`Success: Added 10 Credits (Total: ${current + 10})`);
    };

    const resetUser = async () => {
        setStatus("Resetting to Free...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setStatus("No User Found");

        const { error } = await supabase
            .from('profiles')
            .update({
                subscription_tier: 'free',
                subscription_status: 'inactive',
                credits: 3
            })
            .eq('id', user.id);

        if (error) setStatus("Error: " + error.message);
        else setStatus("Reset: User is Free with 3 Credits.");
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>💰 Billing Simulator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                        Status: <span className="font-mono font-bold text-foreground">{status}</span>
                    </p>
                    <div className="grid gap-2">
                        <Button onClick={simulateSubscription} className="bg-indigo-600 hover:bg-indigo-700">
                            Simulate "Plan Upgrade" (Webhook)
                        </Button>
                        <Button onClick={simulateCredits} variant="outline">
                            Simulate "Buy 10 Credits" (Webhook)
                        </Button>
                        <Button onClick={resetUser} variant="destructive">
                            Reset Me (Free Tier)
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
