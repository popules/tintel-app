import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { I18nProvider } from "@/lib/i18n-context";
import { CookieConsent } from "@/components/layout/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Tintel | The Talent Intelligence Platform",
    template: "%s | Tintel",
  },
  description: "Automate your lead gen. Personalize your outreach. Find your future. Tintel transforms the hidden job market into a strategic advantage.",
  keywords: ["Recruitment", "Talent Intelligence", "AI Recruitment", "Headhunting", "Swedish Tech Jobs", "Vector Search"],
  authors: [{ name: "Tintel AB", url: "https://tintel.se" }],
  creator: "Tintel AB",
  openGraph: {
    title: "Tintel | The Talent Intelligence Platform",
    description: "Automate your lead gen. Personalize your outreach. Find your future.",
    url: "https://tintel.se",
    siteName: "Tintel",
    locale: "sv_SE",
    type: "website",
    images: [
      {
        url: "https://tintel.se/og-image.png", // We will need to ensure this route exists or matches the file we uploaded
        width: 1200,
        height: 630,
        alt: "Tintel Platform Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tintel | The Talent Intelligence Platform",
    description: "Automate your lead gen. Personalize your outreach. Find your future.",
    creator: "@tintelhq",
    images: ["https://tintel.se/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://tintel.se"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The "dark" class name here reactivates our theme
    <html lang="sv" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.className
        )}
      >
        <I18nProvider>
          {children}
          <CookieConsent />
        </I18nProvider>
      </body>
    </html>
  );
}