import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata = {
  title: "Tintel App",
  description: "Live Talent Intelligence Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

