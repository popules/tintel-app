import { LandingHeader } from "@/components/landing/LandingHeader";
import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";
import { TrustSection } from "@/components/landing/TrustSection";

export default function LandingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Tintel",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "SEK"
                },
                "description": "AI-powered talent intelligence platform for modern recruiters."
            },
            {
                "@type": "Organization",
                "name": "Tintel AB",
                "url": "https://tintel.se",
                "logo": "https://tintel.se/logo.png",
                "sameAs": [
                    "https://www.linkedin.com/company/tintelhq"
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LandingHeader />
            <main>
                <Hero />
                <FeatureGrid />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}

