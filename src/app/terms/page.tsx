"use client";

import { useTranslation } from "@/lib/i18n-context";

export default function TermsPage() {
    const { t } = useTranslation();
    const txt = t.public.terms;

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-3xl mx-auto px-4 prose dark:prose-invert">
                <h1>{txt.title}</h1>

                <h2>{txt.intro_title}</h2>
                <p>{txt.intro_text}</p>

                <h2>{txt.use_title}</h2>
                <p>{txt.use_text}</p>

                <h2>{txt.credits_title}</h2>
                <p>{txt.credits_text}</p>

                <h2>{txt.ai_title}</h2>
                <p>{txt.ai_text}</p>

                <h2>{txt.liability_title}</h2>
                <p>{txt.liability_text}</p>

                <h2>{txt.law_title}</h2>
                <p>{txt.law_text}</p>

                <p className="text-sm text-muted-foreground mt-8">{txt.updated}</p>
            </div>
        </div>
    );
}
