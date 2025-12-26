import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { I18nProvider } from "@/lib/i18n-context";

export const metadata: Metadata = {
  title: "Tintel",
  description: "The Talent Intelligence Platform. Automate your lead gen. Personalize your outreach. Find your future.",
  openGraph: {
    title: "Tintel",
    description: "The Talent Intelligence Platform.",
    url: "https://tintel.se",
    siteName: "Tintel",
    locale: "sv_SE",
    type: "website",
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
        </I18nProvider>
      </body>
    </html>
  );
}