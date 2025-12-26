"use client";

import { useTranslation } from "@/lib/i18n-context";

export default function PrivacyPage() {
    const { t } = useTranslation();
    const txt = t.public.privacy;

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-3xl mx-auto px-4 prose dark:prose-invert">
                <h1>{txt.title}</h1>
                <p className="lead">{txt.lead}</p>

                <h2>{txt.intro_title}</h2>
                <p>{txt.intro_text}</p>

                <h2>{txt.collect_title}</h2>
                <p>{txt.collect_text}</p>
                <ul>
                    <li>{txt.collect_li_1}</li>
                    <li>{txt.collect_li_2}</li>
                    <li>{txt.collect_li_3}</li>
                </ul>

                <h2>{txt.use_title}</h2>
                <ul>
                    <li>{txt.use_li_1}</li>
                    <li>{txt.use_li_2}</li>
                    <li>{txt.use_li_3}</li>
                    <li>{txt.use_li_4}</li>
                </ul>

                <h2>{txt.processors_title}</h2>
                <p>{txt.processors_text}</p>
                <ul>
                    <li>{txt.processors_li_1}</li>
                    <li>{txt.processors_li_2}</li>
                    <li>{txt.processors_li_3}</li>
                    <li>{txt.processors_li_4}</li>
                </ul>
                <p>{txt.visibility_text}</p>

                <h2>{txt.rights_title}</h2>
                <p>{txt.rights_text}</p>
                <ul>
                    <li>{txt.rights_li_1}</li>
                    <li>{txt.rights_li_2}</li>
                    <li>{txt.rights_li_3}</li>
                    <li>{txt.rights_li_4}</li>
                </ul>
                <p dangerouslySetInnerHTML={{ __html: txt.contact_text.replace('privacy@tintel.se', '<a href="mailto:privacy@tintel.se">privacy@tintel.se</a>') }} />

                <p className="text-sm text-muted-foreground mt-12 border-t pt-8">{txt.updated}</p>
            </div>
        </div>
    );
}
