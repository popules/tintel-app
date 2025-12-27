'use server'

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createCheckoutSession(type: 'refill' | 'pro', returnUrl: string = '/candidate/dashboard') {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Get candidate data
    const { data: candidate } = await supabase
        .from('candidates')
        .select('stripe_customer_id, email')
        .eq('id', user.id)
        .single()

    let customerId = candidate?.stripe_customer_id

    // If no Stripe ID, create one
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: candidate?.email || user.email,
            metadata: {
                supabase_id: user.id
            }
        })
        customerId = customer.id

        // Save back to DB
        await supabase
            .from('candidates')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id)
    }

    // Define Prices (Replace with Env Vars in prod)
    const PRICE_REFILL = process.env.STRIPE_PRICE_ID_REFILL
    const PRICE_PRO = process.env.STRIPE_PRICE_ID_PRO

    if (!PRICE_REFILL || !PRICE_PRO) {
        return { error: 'Server misconfiguration: Missing Stripe Prices' }
    }

    try {
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: type === 'refill' ? PRICE_REFILL : PRICE_PRO,
                    quantity: 1,
                },
            ],
            mode: type === 'pro' ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}${returnUrl}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${returnUrl}?canceled=true`,
            metadata: {
                userId: user.id,
                type: type
            }
        })

        if (!session.url) throw new Error("No session URL")

        return { url: session.url }
    } catch (err: any) {
        console.error("Stripe Error:", err)
        return { error: err.message }
    }
}
