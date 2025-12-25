# 🚀 Final Vercel Checklist (tintel.se)

Since your site is already live, you just need to sync these settings so the new Payment logic works.

## 1. Open Vercel
Go to your project on Vercel and click **Settings** -> **Environment Variables**.

## 2. Add These 4 Variables
Add these one by one (copy-paste exactly):

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_... (Your Key)` |
| `STRIPE_SECRET_KEY` | `sk_test_... (Your Key)` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_... (Your Secret)` |
| `NEXT_PUBLIC_APP_URL` | `https://tintel.se` |

## 3. Redeploy
1. Go to the **Deployments** tab in Vercel.
2. Find your latest deployment.
3. Click the three dots `...` and select **Redeploy**. (This forces Vercel to "read" the new keys you just added).

---

### FAQ: Sandbox vs. Live
- **Sandbox (Current)**: This is "Test Mode". You can use Stripe's fake credit card (4242...) to test everything. This is what we want for now to make sure it works.
- **Switching to Live**: Once you've tested and are happy, you'll click "Switch to Live account" in Stripe. You'll get NEW keys (starting with `pk_live...` and `sk_live...`). You will then just replace these values in Vercel.

**Need a hand with the Vercel UI?** Just ask!
