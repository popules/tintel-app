import type { Metadata } from "next";
import { Inter } from "next/font/google";
// We only need to import the one global stylesheet now
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tintel — Talent Intelligence",
  description: "Live talent & market intelligence by Tintel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className="dark">
      <body className={inter.className}>
        {/* We can add the cool background layers here directly if we want */}
        <div className="fixed inset-0 -z-10 bg-[#0b0d12]">
          {/* You can add grid/radial/noise divs here if you want them from the shell */}
        </div>
        {children}
      </body>
    </html>
  );
}
