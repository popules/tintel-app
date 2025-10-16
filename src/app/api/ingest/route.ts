// src/app/api/ingest/route.ts
// --- FINAL VERSION USING GET METHOD FOR VERCEL CRON COMPATIBILITY ---

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- SECURE CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const CRON_TOKEN = "supersecret";

export const dynamic = "force-dynamic";
export const maxDuration = 300; 

// The only change is here: from POST to GET
export async function GET(req: Request) {
  console.log("LOG: Ingest function started via GET request.");

  const { searchParams } = new URL(req.url);
  const cronTokenQuery = searchParams.get("cron-token");

  if (cronTokenQuery !== CRON_TOKEN) {
    console.error("LOG: Unauthorized access attempt.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("LOG: Authorization successful.");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("LOG: Supabase environment variables are NOT set.");
    return NextResponse.json({ error: "Database configuration is missing on the server." }, { status: 500 });
  }
  console.log("LOG: Supabase environment variables loaded successfully.");
  
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  try {
    let allJobs = [];
    const limit = 100;
    const maxPages = 20;
    console.log(`LOG: Starting to fetch up to ${maxPages} pages from Platsbanken...`);

    for (let i = 0; i < maxPages; i++) {
      const data = await fetchPlatsbankenPage(i * limit, limit);
      if (data?.hits?.length > 0) {
        allJobs.push(...data.hits);
      } else {
        console.log(`LOG: Stopped fetching at page ${i + 1}, no more results.`);
        break;
      }
    }
    console.log(`LOG: Successfully fetched ${allJobs.length} total jobs from Platsbanken.`);
    
    const validJobs = allJobs.filter(job => job && job.id);
    const categoryMap = new Map();

    const jobsToUpsert = validJobs.map((job: any) => {
      const broadCategoryName = job.occupation_field?.label || null;
      if (job.occupation?.concept_id && job.occupation_field?.concept_id) {
          categoryMap.set(job.occupation.concept_id, {
              id: job.occupation.concept_id, name: job.occupation.label,
              broader_id: job.occupation_field.concept_id, broader_name: job.occupation_field.label,
          });
      }
      return {
        externalId: job.id, title: job.headline, company: job.employer?.name || "Okänt företag",
        category: job.occupation?.label || "Okänd kategori", broad_category: broadCategoryName,
        location: job.workplace_address?.municipality || "Okänd plats", source: "Platsbanken",
        webbplatsurl: job.webpage_url, publishedAt: job.publication_date,
      };
    });
    
    const categoriesToUpsert = Array.from(categoryMap.values());
    console.log(`LOG: Mapped ${jobsToUpsert.length} jobs and discovered ${categoriesToUpsert.length} categories.`);

    console.log("LOG: Upserting jobs to Supabase...");
    const { error: jobsError } = await supabaseAdmin.from("job_posts").upsert(jobsToUpsert, { onConflict: "externalId" });
    if (jobsError) throw new Error(`Supabase jobs upsert failed: ${jobsError.message}`);
    console.log("LOG: Jobs upsert successful.");

    if (categoriesToUpsert.length > 0) {
        console.log("LOG: Upserting categories to Supabase...");
        const { error: categoriesError } = await supabaseAdmin.from("job_categories").upsert(categoriesToUpsert, { onConflict: "id" });
        if (categoriesError) throw new Error(`Supabase categories upsert failed: ${categoriesError.message}`);
        console.log("LOG: Categories upsert successful.");
    }

    return NextResponse.json({
      message: `SUCCESS! Ingest complete.`,
    });

  } catch (error: any) {
    console.error("LOG: Ingestion CRASHED:", error);
    return NextResponse.json({ error: "Ingestion process failed.", details: error.message }, { status: 500 });
  }
}

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