import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new Response(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const supabase = createClient()

    if (event.type === "checkout.session.completed") {
        const userId = session.metadata?.userId
        const type = session.metadata?.type // 'refill' or 'pro'

        if (!userId) return new Response(null, { status: 200 })

        if (type === 'refill') {
            // Grant 50 credits
            await supabase.rpc('increment_credits', { user_id: userId, amount: 50 })
        } else if (type === 'pro') {
            // Upgrade to Pro + Grant 500 credits
            await supabase
                .from('candidates')
                .update({ is_premium: true, oracle_credits: 500 }) // Or increment
                .eq('id', userId)
        }
    }

    return new Response(null, { status: 200 })
}
