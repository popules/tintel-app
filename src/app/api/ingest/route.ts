// app/api/ingest/route.ts
// --- UPGRADED PRODUCTION VERSION ---
// This version automatically builds the category dictionary and saves jobs with broad categories.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- SECURE CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const CRON_TOKEN = "supersecret";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

async function fetchPlatsbankenPage(offset: number, limit: number) {
  const apiUrl = `https://jobsearch.api.jobtechdev.se/search?q=sverige&limit=${limit}&offset=${offset}`;
  const response = await fetch(apiUrl, {
    headers: { "Accept": "application/json", "User-Agent": "TintelApp/1.0" },
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Platsbanken API failed: ${response.status} ${errorBody}`);
  }
  return response.json();
}

export async function POST(req: Request) {
  const cronTokenHeader = req.headers.get("x-cron-token");
  const { searchParams } = new URL(req.url);
  const cronTokenQuery = searchParams.get("cron-token");

  if (cronTokenHeader !== CRON_TOKEN && cronTokenQuery !== CRON_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("Supabase environment variables are not set.");
    return NextResponse.json({ error: "Database configuration is missing on the server." }, { status: 500 });
  }
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    let allJobs = [];
    let currentOffset = 0;
    const limit = 100;
    const maxPages = 20;

    for (let i = 0; i < maxPages; i++) {
      const data = await fetchPlatsbankenPage(currentOffset, limit);
      if (data?.hits?.length > 0) {
        allJobs.push(...data.hits);
        currentOffset += limit;
      } else {
        break;
      }
    }

    if (allJobs.length === 0) {
      return NextResponse.json({ message: "No new jobs found." });
    }

    const validJobs = allJobs.filter(job => job && job.id);
    
    // --- NEW: Prepare data for BOTH tables ---
    const categoryMap = new Map();

    const jobsToUpsert = validJobs.map((job: any) => {
      const broadCategoryName = job.occupation_field?.label || null;
      
      // Add to our category dictionary map if the data exists in this job ad
      if (job.occupation?.concept_id && job.occupation_field?.concept_id) {
          categoryMap.set(job.occupation.concept_id, {
              id: job.occupation.concept_id,
              name: job.occupation.label,
              broader_id: job.occupation_field.concept_id,
              broader_name: job.occupation_field.label,
          });
      }

      return {
        externalId: job.id,
        title: job.headline,
        company: job.employer?.name || "Okänt företag",
        category: job.occupation?.label || "Okänd kategori",
        broad_category: broadCategoryName, // The new doorway field
        location: job.workplace_address?.municipality || "Okänd plats",
        source: "Platsbanken",
        webbplatsurl: job.webpage_url,
        publishedAt: job.publication_date,
      };
    });
    
    const categoriesToUpsert = Array.from(categoryMap.values());

    // --- NEW: Perform TWO upsert operations ---
    
    // 1. Upsert the jobs with the new broad_category field
    const { error: jobsError } = await supabaseAdmin
      .from("job_posts")
      .upsert(jobsToUpsert, { onConflict: "externalId" });
    if (jobsError) throw new Error(`Supabase jobs upsert failed: ${jobsError.message}`);

    // 2. Upsert the categories into our new dictionary table if we found any
    if (categoriesToUpsert.length > 0) {
        const { error: categoriesError } = await supabaseAdmin
            .from("job_categories")
            .upsert(categoriesToUpsert, { onConflict: "id" });
        if (categoriesError) throw new Error(`Supabase categories upsert failed: ${categoriesError.message}`);
    }

    return NextResponse.json({
      total_fetched_from_api: allJobs.length,
      valid_jobs_processed: jobsToUpsert.length,
      categories_discovered: categoriesToUpsert.length,
      message: `SUCCESS! Database and category dictionary updated.`,
    });

  } catch (error: any) {
    console.error("Ingestion failed:", error);
    return NextResponse.json({ error: "Ingestion process failed.", details: error.message }, { status: 500 });
  }
}

