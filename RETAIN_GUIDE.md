# 🛠️ Tintel: DNS & Cron Setup Guide

## 1. Where are Cron Jobs in Vercel?
Once you have pushed the `vercel.json` file, you can find your jobs here:
1.  Go to your **Vercel Dashboard**.
2.  Select the **tintel** project.
3.  Click the **"Settings"** tab.
4.  In the left sidebar, click **"Cron Jobs"**.
5.  You should see `/api/cron/daily-matches` listed there with a "Run" button to test it manually.

---

## 2. Loopia + Resend Guide
**Should you do this?** YES. If you don't, your emails will likely end up in SPAM or show a scary "Unverified Sender" warning.

### Step-by-Step for Loopia:
1.  Log in to **[Loopia Customer Zone](https://www.loopia.se/loggain/)**.
2.  Click on **tintel.se** under "Domain names".
3.  Click **"DNS Records"**.
4.  Add the records shown in your Resend screenshot:

| Type | Host/Name | Value/Content |
| :--- | :--- | :--- |
| **TXT** | `resend._domainkey` | `p=NIGfMA0GCSqGSIb3DQEB...` (Copy exact from Resend) |
| **MX** | `send` | `feedback-smtp.eu-west-1.amazonses.com.` (Priority: 10) |
| **TXT** | `send` | `v=spf1 include:amazonses.com -all` |
| **TXT** | `_dmarc` | `v=DMARC1; p=none;` |

**Important for Loopia:** 
- If Resend gives you a host like `send.tintel.se`, you only enter `send` in the "Host" field in Loopia.
- If it's just `_dmarc`, enter `_dmarc`.

---

## 3. Fixing the 'profiles.email' error
I noticed the error in your screenshot! I assumed the `email` was already in your `profiles` table, but it's currently only in the hidden `auth.users` table.

**The Fix:**
I've created [fix_missing_email.sql](file:///Users/antonaberg/.gemini/antigravity/scratch/tintel-app/fix_missing_email.sql). Run this in your Supabase SQL editor to sync the emails over so the cron job can find them!
