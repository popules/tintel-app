import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { I18nProvider } from "@/lib/i18n-context";

export const metadata: Metadata = {
  title: "Tintel | Hitta dolda jobb och talanger i Sverige",
  description: "Skippa ansöknings-tröttheten. Tintel är marknadsplatsen för dolda jobb och personliga matchningar för blågula proffs. Access the Hidden Job Market.",
  openGraph: {
    title: "Tintel | Hitta dolda jobb och talanger i Sverige",
    description: "Hitta jobben som inte syns på LinkedIn. Tintel samlar den dolda marknaden på ett ställe.",
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