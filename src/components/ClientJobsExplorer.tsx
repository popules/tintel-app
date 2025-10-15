"use client"; // This special line marks this as a "Client-Side Box"

import dynamic from "next/dynamic";

// This is the dynamic import logic, now safely inside a Client Component.
const JobsExplorer = dynamic(() => import("@/components/JobsExplorer"), { 
  ssr: false, 
  loading: () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({length: 6}).map((_,i) => (
        <div key={i} className="h-44 rounded-2xl glass-card animate-pulse" />
      ))}
    </div>
  )
});

// We just pass the baseUrl prop through to the real JobsExplorer component.
export default function ClientJobsExplorer({ baseUrl }: { baseUrl: string }) {
  return <JobsExplorer baseUrl={baseUrl} />;
}
