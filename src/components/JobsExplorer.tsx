"use client";
import { useEffect, useMemo, useState } from "react";

// This is an unstyled, functional-only version of the component.
// It removes all Tailwind CSS classes to guarantee the build passes.

type Job = { 
  id: string | number; 
  title: string; 
  company: string; 
  location: string; 
  category?: string; 
  webbplatsurl?: string; 
  publishedAt?: string;
};
const PER_PAGE = 50;

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
    <section>
      <div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sök titel, företag..." />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ort..." />
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>Senaste 7 dagarna</option>
          <option value={30}>Senaste 30 dagarna</option>
          <option value={60}>Senaste 60 dagarna</option>
        </select>
        <button onClick={() => { setQ(""); setCity(""); setDays(60); }}>Återställ</button>
      </div>

      <hr />

      <div>
        {loading && items.length === 0 ? (
             <div>Laddar jobb...</div>
        ) : err ? (
            <div>Ett fel uppstod: {err}</div>
        ) : (
            <h3>{total ?? "0"} jobb hittades</h3>
        )}
      </div>
      
      <ul>
        {items.map((job) => (
          <li key={job.id} style={{ border: '1px solid grey', margin: '8px 0', padding: '8px' }}>
            <div>
              <a href={job.webbplatsurl} target="_blank" rel="noopener noreferrer">
                <h4>{job.title}</h4>
              </a>
              <p>{job.company}</p>
            </div>
            <div>
              <p>{job.location}</p>
              <p>{formatDate(job.publishedAt)}</p>
            </div>
          </li>
        ))}
      </ul>

      {total && items.length < total && (
        <div>
            <button onClick={() => setPage(p => p + 1)} disabled={loading}>
              {loading ? "Laddar…" : "Ladda fler"}
            </button>
        </div>
      )}
    </section>
  );
}