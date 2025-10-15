// app/api/jobs/route.ts
// Reads from our Supabase table and provides data to the frontend.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Use the public anon key here, as this is a public-facing API.
const SUPABASE_URL = "https://acagdapewlieiseypnho.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYWdkYXBld2xpZWlzZXlwbmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzEyMjcsImV4cCI6MjA3NTcwNzIyN30.UnI45kxihomEa02b97kbr4fSA6trGg13_2Lr7MTio7I";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const offset = Number(url.searchParams.get("offset") ?? "0");
    const search = (url.searchParams.get("q") ?? "").trim();
    const city = (url.searchParams.get("city") ?? "").trim();

    // Start building the query
    let query = supabase
      .from("job_posts") // Correct, lowercase table name
      .select("*", { count: "exact" });

    // Add search filters if they exist
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (city) {
      query = query.ilike('location', `%${city}%`);
    }

    // Execute the query
    const { data: jobs, error, count } = await query
      .order("publishedAt", { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ jobs, total: count });

  } catch (error: any) {
    console.error("Job search failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs.", details: error.message },
      { status: 500 }
    );
  }
}
