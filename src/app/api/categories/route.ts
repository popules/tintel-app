// src/app/api/categories/route.ts
// This API endpoint fetches the unique broad categories from our dictionary.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Securely get the keys from Vercel's vault
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not set for categories API.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // This query selects only the 'broader_name' column from our dictionary,
    // filters out any nulls, and then gets the distinct (unique) values.
    const { data, error } = await supabase
      .from("job_categories")
      .select("broader_name")
      .not("broader_name", "is", null)
      .order("broader_name", { ascending: true });

    if (error) throw error;

    // We use a Set to ensure the list is truly unique, just in case.
    const uniqueCategories = [...new Set(data.map(item => item.broader_name))];

    return NextResponse.json({ categories: uniqueCategories });
    
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories.", details: error.message }, { status: 500 });
  }
}
