import AppShell from "@/components/AppShell";
import dynamic from "next/dynamic";

// Import JobsExplorer dynamically if it uses 'use client' or browser APIs
const JobsExplorer = dynamic(() => import("@/components/JobsExplorer"), { ssr: false, loading: () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({length: 6}).map((_,i) => (
      <div key={i} className="h-44 rounded-2xl glass-card animate-pulse" />
    ))}
  </div>
)});

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return (
    <AppShell>
      {/* Top hero headline */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Jobs Explorer</h1>
        <p className="mt-2 text-gray-400">Live recruitment signals across sectors — filter, search, and benchmark in seconds.</p>
      </div>

      {/* Filters row (example, keep or replace with your real controls) */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search companies, roles, locations…"
          className="w-full md:max-w-lg rounded-xl px-4 py-2.5 bg-white/5 ring-1 ring-white/10 focus:ring-2 focus:ring-white/20 outline-none"
        />
        <div className="flex gap-2">
          <button className="btn-primary">Latest</button>
          <button className="btn-ghost">Trending</button>
          <button className="btn-ghost">Saved</button>
        </div>
      </div>

      {/* Your real data component mounts here */}
      {/* Expecting an existing component at src/components/JobsExplorer.tsx */}
      {/* Pass baseUrl if your component needs it */}
      <div className="space-y-6">
        <JobsExplorer baseUrl={baseUrl} />
      </div>
    </AppShell>
  );
}
