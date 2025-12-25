export const STRIPE_PLANS = {
    // Replace these with your actual Price IDs from Stripe Dashboard
    PRO_SUBSCRIPTION: {
        id: 'price_1SiEkFPAQaS8gta8YStHkmpN', // Found in your logs!
        name: 'Tintel Pro',
        price: '999 SEK',
        description: 'Unlimited access to all candidates.'
    },
    CREDIT_PACK: {
        id: 'price_1SiELXPAQaS8gta8f3LyG1PF',
        name: '10 Credit Pack',
        credits: 10,
        price: '500 SEK',
        description: 'Perfect for occasional hiring. 50 SEK / unlock.'
    }
};
