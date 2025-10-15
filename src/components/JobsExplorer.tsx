"use client";
import { useEffect, useMemo, useState } from "react";

type Job = { 
  id: string | number; 
  title: string; 
  company: string; 
  location: string; 
  category?: string; 
  url?: string; 
  publishedAt?: string;
};
const PER_PAGE = 50;

// Helper function to format dates nicely
function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 1) return `${diffInDays} dagar sedan`;
    if (diffInDays === 1) return `1 dag sedan`;
    if (diffInHours > 1) return `${diffInHours} timmar sedan`;
    if (diffInHours === 1) return `1 timme sedan`;
    if (diffInMinutes > 1) return `${diffInMinutes} minuter sedan`;
    return 'Nyss';
}

// Uppdaterad signatur: Tar emot baseUrl som prop
export default function JobsExplorer({ baseUrl }: { baseUrl: string }) {
  const base = baseUrl; 
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [days, setDays] = useState(60);
  const [items, setItems] = useState<Job[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(
    () => `${base}/api/jobs?days=${days}&limit=${PER_PAGE}&offset=${page * PER_PAGE}&q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`,
    [base, days, page, q, city]
  );

  useEffect(() => { 
    setItems([]); 
    setTotal(null); 
    setPage(0); 
    setLoading(true);
    setErr(null);
  }, [q, city, days]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(query, { cache: "no-store" });
        if (!res.ok) {
            const data = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(data.error || `Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancel) {
          setItems((p) => [...p, ...(data.jobs || [])]);
          setTotal(data.total ?? 0);
        }
      } catch (e: any) { 
          if (!cancel) setErr(e.message); 
      }
      finally { 
          if (!cancel) setLoading(false); 
      }
    })();
    return () => { cancel = true; };
  }, [query]);

  return (
    <section className="space-y-8">
      {/* --- REDESIGNED FILTER BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/20 border border-gray-700/50 rounded-lg">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sök titel, företag..." className="w-full rounded-md bg-gray-900/50 border border-gray-700 px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ort..." className="w-full rounded-md bg-gray-900/50 border border-gray-700 px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full rounded-md bg-gray-900/50 border border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all">
          <option value={7}>Senaste 7 dagarna</option>
          <option value={30}>Senaste 30 dagarna</option>
          <option value={60}>Senaste 60 dagarna</option>
        </select>
        <button onClick={() => { setQ(""); setCity(""); setDays(60); }} className="w-full rounded-md bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 transition-colors">
            Återställ
        </button>
      </div>

      {/* --- TOTALS AND ERROR DISPLAY --- */}
      <div>
        {loading && items.length === 0 ? (
             <div className="text-center py-10 text-gray-500">Laddar jobb...</div>
        ) : err ? (
            <div className="text-center py-10 text-red-400">Ett fel uppstod: {err}</div>
        ) : (
            <div className="text-3xl font-bold text-gray-300">{total ?? "0"} jobb hittades</div>
        )}
      </div>
      
      {/* --- REDESIGNED JOB LIST --- */}
      <ul className="grid grid-cols-1 gap-4">
        {items.map((job) => (
          <li key={job.id} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-5 transition-all hover:border-cyan-500/50 hover:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-gray-100 hover:text-cyan-400 transition-colors">
                  {job.title}
                </a>
                <div className="text-md text-gray-400 mt-1">{job.company}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-medium text-gray-300">{job.location}</div>
                <div className="text-sm text-gray-500 mt-1">{formatDate(job.publishedAt)}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* --- LOAD MORE BUTTON --- */}
      {total && items.length < total && (
        <div className="text-center pt-4">
            <button onClick={() => setPage(p => p + 1)} disabled={loading} className="bg-cyan-600/50 hover:bg-cyan-500/50 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Laddar…" : "Ladda fler"}
            </button>
        </div>
      )}
    </section>
  );
}