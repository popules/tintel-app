// app/page.tsx (Komplett, fixad version)

export const dynamic = "force-dynamic";

import JobsExplorer from "../components/JobsExplorer";

// --- THE FIX IS HERE: Updated the URL to the correct, new service ---
const PROD_BASE_URL = "https://tintel-service-951132763829.europe-north1.run.app"; 

export default function Page() {
  // Beräkna den absoluta bas-URL:en på servern
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.NODE_ENV === 'production' ? PROD_BASE_URL : 'http://localhost:3000');
                  
  return (
    <main className="min-h-screen bg-[#0b0e13] text-neutral-200">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 flex items-end justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Tintel · Rekryteringsinsikter
          </h1>
          <span className="text-sm opacity-60">live från Supabase</span>
        </header>

        {/* Skicka in baseUrl som prop */}
        <JobsExplorer baseUrl={baseUrl} />
      </div>
    </main>
  );
}
