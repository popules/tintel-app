
export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-3xl mx-auto px-4 prose dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p className="lead">Your privacy is important to us. This policy explains how we handle your data.</p>

                <h2>1. Intro</h2>
                <p>Tintel AB ("we", "us") operates the website tintel.se. We are committed to protecting your personal data in accordance with GDPR.</p>

                <h2>2. Data We Collect</h2>
                <ul>
                    <li><strong>Account Data:</strong> Name, email, password (hashed).</li>
                    <li><strong>Profile Data:</strong> CVs, skills, photos (uploaded by you).</li>
                    <li><strong>Usage Data:</strong> How you interact with our service.</li>
                    <li><strong>AI Interaction:</strong> Inputs you provide to generating AI features (bios, pitches).</li>
                </ul>

                <h2>3. How We Use Data</h2>
                <p>We use your data to:</p>
                <ul>
                    <li>Provide the recruitment platform services.</li>
                    <li>Match candidates with job opportunities (AI Matching).</li>
                    <li>Improve our AI models (anonymized data only).</li>
                    <li>Process payments (via Stripe).</li>
                </ul>

                <h2>4. Data Sharing</h2>
                <p>We do not sell your data. We share data only with:</p>
                <ul>
                    <li><strong>Service Providers:</strong> Hosting (Vercel), Database (Supabase), AI (OpenAI).</li>
                    <li><strong>Recruiters (for Candidates):</strong> Only data you explicitly choose to make public or share.</li>
                </ul>

                <h2>5. Your Rights</h2>
                <p>You have the right to access, correct, delete, or export your data at any time. Contact us at <a href="mailto:privacy@tintel.se">privacy@tintel.se</a>.</p>

                <p className="text-sm text-muted-foreground mt-8">Last updated: December 24, 2025</p>
            </div>
        </div>
    );
}
