
export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            <div className="container max-w-3xl mx-auto px-4 prose dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p className="lead">Your privacy is important to us. This policy explains how we handle your data.</p>

                <h2>1. Introduction</h2>
                <p>Tintel AB ("we", "us", "our") operates the website tintel.se (the "Service"). We are committed to protecting your personal data and ensuring transparency in accordance with the General Data Protection Regulation (GDPR).</p>

                <h2>2. Data We Collect</h2>
                <p>We collect only the information necessary to provide our recruitment services:</p>
                <ul>
                    <li><strong>Account Information:</strong> Name, email address, and encrypted password.</li>
                    <li><strong>Professional Profile:</strong> CVs, work history, skills, and portfolio items you voluntarily upload.</li>
                    <li><strong>Usage Data:</strong> Anonymized metrics on how you interact with our platform to help us improve performance.</li>
                </ul>

                <h2>3. How We Use Your Data</h2>
                <ul>
                    <li>To operate and maintain the Tintel recruitment platform.</li>
                    <li>To provided AI-powered matchmaking services (connecting candidates with relevant job openings).</li>
                    <li>To process subscription payments.</li>
                    <li>To detect and prevent fraudulent use of the Service.</li>
                </ul>

                <h2>4. Data Processors & Sharing</h2>
                <p>We strictly do <strong>not</strong> sell your personal data to third parties. We share data only with trusted third-party service providers ("Data Processors") who assist us in operating our Service. These processors are contractually bound to protect your data:</p>
                <ul>
                    <li><strong>Vercel Inc. (Hosting):</strong> Uses server infrastructure to deliver the website.</li>
                    <li><strong>Supabase Inc. (Database):</strong> Securely stores user profiles and application data.</li>
                    <li><strong>OpenAI (AI Processing):</strong> Processes text inputs (e.g., bio generation) to provide AI features. <em>Note: Our agreement with OpenAI prevents them from using your data to train their models.</em></li>
                    <li><strong>Stripe (Payments):</strong> Processes billing information securely. We do not store credit card details on our servers.</li>
                </ul>
                <p>For Candidates: Your profile information is visible to verified Recruiters on the platform if you choose to make your profile "Public" or "Open to Work".</p>

                <h2>5. Your Rights (GDPR)</h2>
                <p>Under GDPR, you have the right to:</p>
                <ul>
                    <li><strong>Access:</strong> Request a copy of all data we hold about you.</li>
                    <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
                    <li><strong>Erasure ("Right to be Forgotten"):</strong> Request complete deletion of your account and data.</li>
                    <li><strong>Portability:</strong> Receive your data in a structured, commonly used format.</li>
                </ul>
                <p>To exercise any of these rights, please contact our Data Protection Officer at <a href="mailto:privacy@tintel.se">privacy@tintel.se</a>.</p>

                <p className="text-sm text-muted-foreground mt-12 border-t pt-8">Last updated: December 24, 2025</p>
            </div>
        </div>
    );
}
