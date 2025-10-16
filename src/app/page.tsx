"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox } from "@/components/ui/custom/multi-select-combobox";
import { supabase } from "@/lib/supabase/client";

// --- TYPE DEFINITIONS ---
type JobPost = {
  id: string;
  title: string;
  company: string;
  city: string;
  created_at: string;
  webbplatsurl: string;
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  // --- STATE MANAGEMENT ---
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- DATA FETCHING ---
  const fetchJobs = async () => {
    setIsLoading(true);
    let query = supabase.from("job_posts").select("*").order("created_at", { ascending: false }).limit(100);

    if (selectedCategories.length > 0) query = query.in("broad_category", selectedCategories);
    if (selectedLocations.length > 0) query = query.in("location", selectedLocations);
    if (searchTerm) query = query.ilike("title", `%${searchTerm}%`);

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching jobs:", error);
      setJobPosts([]);
    } else {
      setJobPosts(data);
    }
    setIsLoading(false);
  };

  // Runs once on page load
  useEffect(() => {
    const fetchFilterData = async () => {
      const { data: catData } = await supabase.from("job_categories").select("broader_name");
      if (catData) setCategories([...new Set(catData.map((c) => c.broader_name))].sort());

      const { data: locData } = await supabase.from("job_posts").select("location");
      if (locData) setLocations([...new Set(locData.filter(l => l.location).map(l => l.location))].sort());

      fetchJobs();
    };
    fetchFilterData();
  }, []);

  // Runs whenever any filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedCategories, selectedLocations, searchTerm]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold">tintel</h1>
      </header>
      <main className="flex flex-1 w-full p-4 md:p-6">
        <div className="grid w-full gap-6 grid-cols-[280px_1fr]">
          <aside className="flex flex-col gap-4">
            <Card className="w-full h-fit">
              <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={cat}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => handleCategoryToggle(cat)}
                    />
                    <label
                      htmlFor={cat}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {cat}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
          
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Search by job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MultiSelectCombobox
                options={locations}
                selected={selectedLocations}
                onChange={setSelectedLocations}
                placeholder="Select locations..."
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Jobs Explorer</CardTitle>
                <CardDescription>
                  {isLoading ? "Loading..." : `Showing ${jobPosts.length} results`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPosts.map((job) => (
                    <a key={job.id} href={job.webbplatsurl} target="_blank" rel="noopener noreferrer" className="block">
                      <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
                        <CardHeader>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>{job.company} - {job.city}</CardDescription>
                        </CardHeader> {/* <-- THIS IS THE CORRECTED LINE */}
                      </Card>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}