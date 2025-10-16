"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CategorySidebar from "@/components/CategorySidebar"; // Import our new component

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex h-14 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center justify-center rounded-xl px-2 py-2 hover:bg-white/5 md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle navigation"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/tintel-logo.svg" alt="Tintel" width={24} height={24} />
                <span className="font-semibold tracking-tight text-white text-lg">tintel</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <TopNavLink href="#" label="Dashboard" active />
              <TopNavLink href="#" label="Signals" />
              <TopNavLink href="#" label="Companies" />
              <TopNavLink href="#" label="Saved" />
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost">Log in</button>
              <button className="btn-primary">Try Beta</button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex gap-6 pt-6">
          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform transition-transform duration-300 ease-in-out md:sticky md:top-14 md:h-[calc(100vh-56px)] md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {/* --- THIS IS THE CHANGE --- */}
            {/* The old placeholder content is replaced with our live, data-driven component */}
            <CategorySidebar />
          </aside>
          
          {/* Overlay for mobile view to close the sidebar */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main content */}
          <main className="w-full pb-16">
            {/* Hero card */}
            <section className="rounded-3xl glass-card p-6 mb-6 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-tr from-[#0ea5e9]/20 to-[#22d3ee]/10 blur-3xl" />
              <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gradient-to-tr from-[#a78bfa]/15 to-[#22c55e]/10 blur-3xl" />
              <div className="relative">
                <h2 className="text-xl md:text-2xl font-semibold mb-1 text-white">Talent & Market Signals</h2>
                <p className="text-gray-400 text-sm md:text-base">Real-time job market telemetry. Spot demand shifts, map competitors, and move first.</p>
              </div>
            </section>

            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Tintel. All rights reserved.
      </footer>
    </div>
  );
}

function TopNavLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={"px-3 py-2 rounded-xl text-sm " + (active ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-300")}
    >
      {label}
    </a>
  );
}