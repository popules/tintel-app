// src/app/api/jobs/route.ts
// This version securely reads the PUBLIC anon key from Vercel's environment.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// These lines tell the app to get the keys from the Vercel vault.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not set.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const url = new URL(req.url);
  const days = Number(url.searchParams.get("days") ?? "60");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 200);
  const offset = Number(url.searchParams.get("offset") ?? "0");
  const search = (url.searchParams.get("q") ?? "").trim();
  const city = (url.searchParams.get("city") ?? "").trim();

  const sinceISO = new Date(Date.now() - days * 86400000).toISOString();

  let query = supabase
    .from("job_posts")
    .select("*", { count: "exact" })
    .gte("publishedAt", sinceISO);

  if (search) {
    query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`);
  }

  if (city) {
    query = query.ilike("location", `%${city}%`);
  }

  const { data, error, count } = await query
    .order("publishedAt", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Supabase query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const jobs = (data || []).map((r: any) => ({
    id: r.externalId,
    title: r.title,
    company: r.company,
    location: r.location,
    category: r.category,
    url: r.webbplatsurl,
    publishedAt: r.publishedAt,
  }));

  return NextResponse.json({
    jobs,
    total: count,
  });
}
