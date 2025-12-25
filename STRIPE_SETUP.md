# Stripe Setup Guide 💳

Tintel is ready for payments! Follow these steps to connect your Stripe account.

## 1. Get API Keys
1.  Go to [dashboard.stripe.com/register](https://dashboard.stripe.com/register) and sign up.
2.  In **Developers > API keys**:
    *   Copy **Publishable Key** -> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    *   Copy **Secret Key** -> `STRIPE_SECRET_KEY`
3.  Add these to your `.env.local` file.

## 2. Create Products
You need 2 "Products" in Stripe Catalog.

### A. Subscription (Pro Plan)
1.  **Product Catalog > Add Product**.
2.  Name: "Tintel Pro".
3.  Pricing Model: **Recurring**.
4.  Price: e.g., **999 SEK** / Month.
5.  Copy the **Price ID** (starts with `price_...`).

### B. Credits (Pay-as-you-go)
1.  **Product Catalog > Add Product**.
2.  Name: "10 Credit Pack".
3.  Pricing Model: **One-off**.
4.  Price: e.g., **500 SEK**.
5.  Copy the **Price ID**.

## 3. Webhook Setup (Local Testing)
To test payments locally, you need the Stripe CLI or use the Dashboard.

1.  **Dashboard > Developers > Webhooks**.
2.  Add Endpoint: `https://your-url.com/api/webhooks/stripe`.
3.  Select Event: `checkout.session.completed`.
4.  Copy **Signing Secret** (`whsec_...`) -> `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

**Next Step for Logic:**
For the UI to work, you will need to replace the `PRICE_ID` placeholders in the frontend code with your actual Price IDs.
