// scripts/populate-categories.ts
// This is a one-time use script to fill our job_categories table.

import { createClient } from "@supabase/supabase-js";

// --- IMPORTANT: Paste your secret keys here for this one-time run ---
const SUPABASE_URL = "https://acagdapewlieiseypnho.supabase.co";
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYWdkYXBld2xpZWlzZXlwbmhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDEzMTIyNywiZXhwIjoyMDc1NzA3MjI3fQ.o6zAMu_kJM9JBEOvuiJ6I-k3VjGOvNizEEKVeRf9t10";
// -----------------------------------------------------------------

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function fetchAllCategories() {
  console.log("Connecting to Platsbanken's taxonomy API...");
  
  // --- THIS IS THE FIX: Using the correct, official URL for the category dictionary ---
  const apiUrl = "https://taxonomy.api.jobtechdev.se/v1/taxonomies/occupation-field/concepts";
  
  const response = await fetch(apiUrl, {
    headers: {
      "User-Agent": "TintelApp/1.0 (contact: hello@tintel.se)",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    console.error("--- FETCH FAILED! ---");
    console.error(`Reason (Status Code): ${response.status}`);
    const errorBody = await response.text();
    console.error(`Response Body (The Clue): ${errorBody}`);
    console.error("-----------------------");
    throw new Error(`Failed to fetch categories. Status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`Found ${data.length} broad categories.`);
  return data;
}

async function run() {
  try {
    const broadCategories = await fetchAllCategories();
    let categoriesToUpsert = [];

    for (const broadCategory of broadCategories) {
      // This API gives us a flat list, so we just add each one.
      // We can infer relationships later if needed, but for now, this gets all the data.
      categoriesToUpsert.push({
        id: broadCategory.id,
        name: broadCategory.preferred_label,
        broader_id: null, 
        broader_name: broadCategory.type, // Using 'type' as a top-level grouping
      });
    }

    console.log(`Prepared ${categoriesToUpsert.length} total categories for the dictionary.`);

    console.log("Saving dictionary to Supabase...");
    const { error } = await supabaseAdmin
      .from("job_categories")
      .upsert(categoriesToUpsert, { onConflict: "id" });

    if (error) {
      throw error;
    }

    console.log("SUCCESS! Your category dictionary has been built.");
  } catch (error) {
    console.error("\n--- SCRIPT FAILED ---");
    console.error("An error occurred during the script execution:", error.message);
    console.error("---------------------\n");
  }
}

run();