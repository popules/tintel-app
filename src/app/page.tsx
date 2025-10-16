"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
type LocationData = {
  county: string;
  location: string;
};

// --- MAIN PAGE COMPONENT ---
export default function Home() {
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

  // --- DATA FETCHING ---
  const fetchJobs = async () => { // <-- THIS IS THE CORRECTED LINE
    setIsLoading(true);
    let query = supabase.from("job_posts").select("*").order("created_at", { ascending: false }).limit(100);

    if (selectedCategories.length > 0) query = query.in("broad_category", selectedCategories);
    if (selectedCounty) query = query.eq("county", selectedCounty);
    if (selectedCity) query = query.eq("location", selectedCity);
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

  useEffect(() => {
    const fetchFilterData = async () => {
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
                    <Checkbox id={cat} checked={selectedCategories.includes(cat)} onCheckedChange={() => handleCategoryToggle(cat)} />
                    <label htmlFor={cat} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{cat}</label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
          
          <section className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Search by job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="col-span-3 md:col-span-1"
              />
              <Select onValueChange={(value) => setSelectedCounty(value === "all" ? null : value)} value={selectedCounty || 'all'}>
                <SelectTrigger className={!selectedCounty ? "text-muted-foreground" : "text-foreground"}>
                    <SelectValue placeholder="Select a county..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  {finalSortedCounties.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county === "Okänt län" ? "Obestämd ort" : county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSelectedCity(value === "all" ? null : value)} value={selectedCity || 'all'} disabled={!selectedCounty}>
                <SelectTrigger className={!selectedCity ? "text-muted-foreground" : "text-foreground"}>
                    <SelectValue placeholder="Select a city..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city === "Okänd plats" ? "Obestämd ort" : city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Jobs Explorer</CardTitle>
                <CardDescription>{isLoading ? "Loading..." : `Showing ${jobPosts.length} results`}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPosts.map((job) => (
                    <a key={job.id} href={job.webbplatsurl} target="_blank" rel="noopener noreferrer" className="block">
                      <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
                        <CardHeader>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>{job.company} - {job.city}</CardDescription>
                        </CardHeader>
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