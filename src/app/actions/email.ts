"use server";

import { Resend } from 'resend';
import { getWelcomeEmailHtml } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
    if (!process.env.RESEND_API_KEY) {
        console.error("Resend API Key missing");
        return { success: false, error: "Configuration Error" };
    }

    try {
        const html = getWelcomeEmailHtml({
            name: name || 'Recruiter',
            links: {
                dashboard: `${process.env.NEXT_PUBLIC_APP_URL}/company/dashboard` || 'https://tintel.se/company/dashboard',
                home: `${process.env.NEXT_PUBLIC_APP_URL}` || 'https://tintel.se'
            }
        });

        const data = await resend.emails.send({
            from: 'Tintel <hello@tintel.se>', // Ensure this domain is verified in Resend
            to: email,
            subject: 'Welcome to Tintel! 🚀',
            html: html,
        });

        return { success: true, data };
    } catch (error: any) {
        console.error("Welcome Email Error:", error);
        return { success: false, error: error.message };
    }
}
