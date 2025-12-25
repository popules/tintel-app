# 🟢 Tintel: Going Live with Stripe

Follow these steps to transition from Test Mode to Live Mode and start accepting real payments on `tintel.se`.

## Phase 1: Stripe Dashboard (Live Mode)

1.  **Toggle Live Mode**: In your Stripe Dashboard, click the **"Test Mode"** toggle in the top right to switch to **Live Mode**.
2.  **Create Pro Product**:
    *   Go to **Product Catalog** -> **Add Product**.
    *   Name: `Tintel Pro`
    *   Price: `999`
    *   Currency: `SEK`
    *   Interval: `Monthly`
    *   **Save Product** and copy the **Price ID** (starts with `price_...`).
3.  **Get Live Keys**:
    *   Go to **Developers** -> **API Keys**.
    *   Copy your **Publishable key** (`pk_live_...`).
    *   Copy your **Secret key** (`sk_live_...`).
4.  **Set Up Live Webhook**:
    *   Go to **Developers** -> **Webhooks**.
    *   Click **"Add endpoint"**.
    *   Endpoint URL: `https://tintel.se/api/webhooks/stripe`
    *   Select events: `checkout.session.completed` and `customer.subscription.deleted`.
    *   **Add endpoint** and then copy the **Signing secret** (`whsec_...`).

## Phase 2: Vercel Configuration

Update these 4 environment variables in your Vercel Project Settings:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (Your Live Key) |
| `STRIPE_SECRET_KEY` | `sk_live_...` (Your Live Key) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (Your Live Webhook Secret) |
| `NEXT_PUBLIC_APP_URL` | `https://tintel.se` |

## Phase 3: Code Update

I need to update the `priceId` in the code to match your new Live Price ID. 

> [!IMPORTANT]
> Once you have created the **Pro** product in Live Mode, please send me the **Price ID** (e.g., `price_1T...`). I will then update the "Get Pro" button to point to it.

## Phase 4: Final Deploy

After updating the environment variables in Vercel:
1.  Go to the **Deployments** tab in Vercel.
2.  Select your latest deployment and click **Redeploy**.

## 🆘 Account Recovery (The "Backup Key")

If you are blocked by the passkey/iPhone restriction, you can use your **Backup Key** (Recovery Code) to regain access.

1.  Go to the Stripe Login page.
2.  Enter your email and password.
3.  When it asks for the Passkey/Scan, look for a link that says **"Try another way"** or **"Use a recovery code"**.
4.  Enter the long alphanumeric code you have saved locally.
5.  **Important**: Once inside, go to **Settings** -> **Team** -> **Your Profile** -> **Two-step authentication** and switch to **SMS** or an **Authenticator App** (like Google Authenticator) so you don't need the camera anymore.

## 🇸🇪 Swedish & B2B Alternatives

If Stripe remains a blocker, here are the best alternatives for the Swedish market:

### 1. Swish Recurring (via Waytobill)
*   **Best for**: Subscription SaaS in Sweden.
*   **Pros**: Everyone has Swish; highest conversion in Sweden.
*   **Cons**: Requires a partner like Waytobill or Mondido to handle the recurring logic.

### 2. Klarna
*   **Best for**: B2C (Consumer) apps.
*   **Cons**: For B2B/SaaS, it's often more complex to set up subscriptions compared to Stripe.

### 3. Paddle (Merchant of Record)
*   **Best for**: Global SaaS.
*   **Pros**: They handle all VAT/tax for you.
*   **Cons**: Higher fees than Stripe.

### 4. Manual Invoicing (The "B2B Special")
*   **Best for**: Very early stage.
*   **How**: Instead of a payment link, the "Get Pro" button opens a form. You send a PDF invoice (via Fortnox/Pequest) and manually toggle the "Pro" status in the Tintel Admin dashboard.
*   **Zero technical friction.**

---

**My Recommendation**: 
Having the backup key means you can fix the Stripe issue in 2 minutes. Stripe is already 100% integrated into Tintel; switching to another provider now would take days of new code. 

**Try the "Use a recovery code" path first!**
