import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const priceId = searchParams.get('priceId');
    const planType = searchParams.get('planType');
    const creditsAmount = searchParams.get('creditsAmount');

    if (!priceId) {
        return new NextResponse("Price ID is required", { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: planType === 'subscription' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: user.id,
                planType: planType || 'payment',
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

        // Redirect directly to Stripe
        return NextResponse.redirect(session.url!, 303);
    } catch (err: any) {
        console.error("Stripe Error:", err);
        return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId, planType, creditsAmount } = await req.json();

    try {
        const session = await stripe.checkout.sessions.create({
            mode: planType === 'subscription' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
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

