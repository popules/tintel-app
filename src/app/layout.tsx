import type { Metadata } from "next";
import "./globals.css";
// --- THIS IS THE FIX: Using the correct, absolute import path ---
import "@/styles/tintel.css";

export const metadata: Metadata = {
  title: "Tintel — Talent Intelligence",
  description: "Live talent & market intelligence by Tintel",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className="dark">
      <body className="antialiased text-gray-200 bg-[#0b0d12]">
        {/* Background layers */}
        <div className="fixed inset-0 -z-10">
          {/* Subtle grid */}
          <div className="pointer-events-none tintel-grid opacity-20" />
          {/* Radial gradient glow */}
          <div className="pointer-events-none tintel-radial" />
          {/* Noise overlay */}
          <div className="pointer-events-none tintel-noise opacity-40" />
        </div>
        {children}
      </body>
    </html>
  );
}