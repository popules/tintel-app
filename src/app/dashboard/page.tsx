"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { JobCard } from "@/components/dashboard/JobCard";
import { StatsRow } from "@/components/dashboard/Stats";
import { Loader2 } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface JobPost {
  id: string;
  title: string;
  company: string;
  broad_category: string;
  location: string;
  county: string;
  webbplatsurl: string;
  created_at: string;
}
type LocationData = {
  county: string;
  location: string;
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const supabase = createClient();
  // --- STATE MANAGEMENT ---
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  // --- DATA FETCHING ---
  const fetchJobs = async () => {
    setIsLoading(true);
    let query = supabase.from("job_posts").select("*").order("created_at", { ascending: false }).limit(100);

    if (selectedCategories.length > 0) query = query.in("broad_category", selectedCategories);
    if (selectedCounty) query = query.eq("county", selectedCounty);
    if (selectedCity) query = query.eq("location", selectedCity);
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching jobs:", error);
      setJobPosts([]);
    } else {
      setJobPosts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      // 1. Fetch User & Saved Jobs
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: savedData } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user.id);
        if (savedData) {
          setSavedJobIds(new Set(savedData.map(d => String(d.job_id))));
        }
      }

      // 2. Fetch Filter Data
      const { data: catData } = await supabase.from("job_categories").select("broader_name");
      if (catData) setCategories([...new Set(catData.map((c) => c.broader_name))].sort());

      const { data: locData } = await supabase.from("job_posts").select("county, location");
      if (locData) {
        const uniqueLocations = Array.from(new Map(locData.map(item => [`${item.county}-${item.location}`, item])).values());
        setLocations(uniqueLocations.filter(l => l.county && l.location));
      }
      fetchJobs();
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    if (selectedCounty) {
      const citiesInCounty = [...new Set(locations.filter(l => l.county === selectedCounty).map(l => l.location))];
      const specialCity = "Okänd plats";
      const sortedCities = citiesInCounty.sort((a, b) => {
        const aIsSpecial = a === specialCity;
        const bIsSpecial = b === specialCity;
        if (aIsSpecial && !bIsSpecial) return 1;
        if (!aIsSpecial && bIsSpecial) return -1;
        return a.localeCompare(b);
      });
      setAvailableCities(sortedCities);
    } else {
      setAvailableCities([]);
    }
    setSelectedCity(null);
  }, [selectedCounty, locations]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedCategories, selectedCounty, selectedCity, searchTerm]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const uniqueCounties = [...new Set(locations.map(l => l.county))];
  const specialCases = ["Okänt län", "Obestämd ort", "Utomlands"];
  const finalSortedCounties = uniqueCounties.sort((a, b) => {
    const aIsSpecial = specialCases.includes(a);
    const bIsSpecial = specialCases.includes(b);
    if (aIsSpecial && !bIsSpecial) return 1;
    if (!aIsSpecial && bIsSpecial) return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="flex flex-1 w-full">
        <FilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          handleCategoryToggle={handleCategoryToggle}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          counties={finalSortedCounties}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cities={availableCities}
        />

        <section className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-4rem)] bg-muted/5">
          <div className="max-w-7xl mx-auto space-y-8">
            <StatsRow />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Jobs</h2>
                <p className="text-muted-foreground text-sm">Find your next client or career move.</p>
              </div>
              <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
                <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                  {isLoading ? "..." : jobPosts.length} matches
                </span>
              </div>
            </div>

            {isLoading && jobPosts.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[220px] rounded-xl border bg-card/50 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 w-3/4">
                        <div className="h-5 w-1/3 bg-muted rounded animate-pulse" />
                        <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    </div>
                    <div className="space-y-2 pt-4">
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {jobPosts.map((job, index) => (
                  <JobCard key={job.id} job={job as any} index={index} initialSaved={savedJobIds.has(job.id)} />
                ))}
              </div>
            )}

            {!isLoading && jobPosts.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                <p className="text-lg font-medium">No jobs found matching your criteria.</p>
                <p className="text-sm">Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}