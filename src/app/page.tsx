import AppShell from "@/components/AppShell";
import ClientJobsExplorer from "@/components/ClientJobsExplorer"; // Import our new client component

export default function Page() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  return (
    <AppShell>
      {/* Top hero headline */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Jobs Explorer</h1>
        <p className="mt-2 text-gray-400">Live recruitment signals across sectors — filter, search, and benchmark in seconds.</p>
      </div>
      
      {/* We are now using the safe client component to render the JobsExplorer */}
      <div className="space-y-6">
        <ClientJobsExplorer baseUrl={baseUrl} />
      </div>
    </AppShell>
  );
}

