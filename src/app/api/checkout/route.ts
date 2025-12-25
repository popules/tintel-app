import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId, planType, creditsAmount } = await req.json();

    // planType: 'credits' | 'subscription'
    // creditsAmount: number (only if planType === 'credits')

    try {
        const session = await stripe.checkout.sessions.create({
            mode: planType === 'subscription' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            customer_email: user.email, // Pre-fill email
            metadata: {
                userId: user.id,
                planType,
                creditsAmount: creditsAmount ? String(creditsAmount) : '0'
            },
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/company/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/company/dashboard?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("Stripe Error:", err);
        return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
    }
}
