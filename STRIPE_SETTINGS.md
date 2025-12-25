# Enabling Payment Methods (Klarna, Swish, etc.) 💳

To look "premium" and trustworthy in Sweden, you should offer **Klarna** and **Card** payments. Good news: You don't need to write code for this! Stripe handles it.

## 1. Enable Methods in Stripe
1.  Go to **Stripe Dashboard** (dashboard.stripe.com).
2.  Click **Settings** (gear icon) -> **Payment methods**.
3.  Select your configuration (usually "Default").
4.  Find **Klarna** and click **Turn on**.
    *   *Note: Klarna requires your business to be in an eligible country (Sweden is eligible).*
5.  Find **Swish** (if available) or **Bancontact**, **Apple Pay**, **Google Pay**.
    *   *Apple/Google Pay is usually on by default.*

## 2. Verify "Checkout Session"
Our code uses the hosted Stripe Checkout page. This means whatever you enable in the dashboard will **automatically** appear on the payment page users see.

## 3. Branding
1.  Go to **Settings** -> **Branding**.
2.  Upload your **Logo** and **Icon**.
3.  Set your **Brand Color** (Use Tintel Indigo: `#6366f1`).
4.  This makes the checkout page look like part of your app, not a generic page.

**Done!** No code changes needed.
