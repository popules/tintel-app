// app/page.tsx (Final Corrected Version)
export const dynamic = "force-dynamic";

// --- THIS IS THE FIX: Using the correct import path ---
import JobsExplorer from "@/components/JobsExplorer";

// This is a Vercel-specific environment variable that gives us the production URL.
const PROD_BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export default function Page() {
  // This logic correctly determines the base URL whether in production on Vercel or running locally.
  const baseUrl = process.env.NODE_ENV === 'production' ? PROD_BASE_URL : 'http://localhost:3000';
                  
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 flex items-end justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Tintel · Rekryteringsinsikter
          </h1>
          <span className="text-sm opacity-60">live från Supabase</span>
        </header>

        {/* The component now receives the correct URL */}
        <JobsExplorer baseUrl={baseUrl} />
      </div>
    </main>
  );
}
