"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/dashboard/Header";
import { FilterSidebar } from "@/components/dashboard/FilterSidebar";
import { JobCard } from "@/components/dashboard/JobCard";
import { CandidateCard } from "@/components/dashboard/CandidateCard";
import { StatsRow } from "@/components/dashboard/Stats";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n-context";

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

interface JobMarketplaceProps {
    mode: 'recruiter' | 'candidate';
}

export function JobMarketplace({ mode }: JobMarketplaceProps) {
    const supabase = createClient();
    const { t } = useTranslation();
    // --- STATE MANAGEMENT ---
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [prefLoaded, setPrefLoaded] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

    // New State for Marketplace Pivot
    // If candidate mode, default to 'jobs' and maybe hide the toggle?
    const [searchMode, setSearchMode] = useState<'jobs' | 'people'>('jobs');
    const [candidates, setCandidates] = useState<any[]>([]);
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

    // --- DATA FETCHING ---
    const fetchJobs = async () => {
        setIsLoading(true);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        let query = supabase
            .from("job_posts")
            .select("*")
            .gt("created_at", thirtyDaysAgo) // THE GOLDEN FILTER: Only show active leads
            .order("created_at", { ascending: false })
            .limit(100);

        if (selectedCategories.length > 0) query = query.in("broad_category", selectedCategories);
        if (selectedCounties.length > 0) query = query.in("county", selectedCounties);
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

    const fetchCandidates = async () => {
        // Only recruiters can search candidates
        if (mode === 'candidate') {
            setCandidates([]);
            return;
        }

        setIsLoading(true);

        // Fetch unlocks to sync state
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: unlocks } = await supabase.from('unlocks').select('candidate_id').eq('recruiter_id', user.id);
            if (unlocks) {
                setUnlockedIds(new Set(unlocks.map(u => u.candidate_id)));
            }
        }

        // Mode 1: Smart AI Search (Vector)
        // If user typed a search term, we use vector search
        if (searchTerm && searchTerm.length > 2) {
            try {
                const { searchCandidates } = await import("@/app/actions/search");
                const result = await searchCandidates(searchTerm);

                if (result.success && result.data) {
                    setCandidates(result.data);
                } else {
                    setCandidates([]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // Mode 2: Browse All (Basic Supabase Query)
        let query = supabase
            .from('candidates')
            .select('*')
            .eq('is_open', true)
            .order('created_at', { ascending: false });

        // Apply Filters (Location is key)
        if (selectedCounties.length > 0) {
            // Logic for location filtering if columns exist
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching candidates:", error);
            setCandidates([]);
        } else {
            setCandidates(data || []);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        const fetchFilterData = async () => {
            // 1. Fetch User & Preferences
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch saved job IDs
                // Candidate: check 'applications'? No, 'saved_jobs' works for both technically? 
                // Actually for candidates we might want to check 'applications' or just 'saved_jobs' if we decide to use that table for bookmarking.
                // For now, let's just stick to 'saved_jobs' which currently exists.
                const { data: savedData } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user.id);
                if (savedData) {
                    setSavedJobIds(new Set(savedData.map(d => String(d.job_id))));
                }

                // Fetch territories (Intelligence Scope)
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("territories, home_city")
                    .eq("id", user.id)
                    .single();

                if (profile?.territories && profile.territories.length > 0) {
                    setSelectedCounties(profile.territories);
                } else if (profile?.home_city) {
                    // Fallback if territories not set but home_city is
                    setSelectedCounties([profile.home_city]);
                }
            }

            // 2. Fetch Filter Metadata
            const { data: catData } = await supabase.from("job_categories").select("broader_name");
            if (catData) setCategories([...new Set(catData.map((c) => c.broader_name))].sort());

            const { data: locData } = await supabase.from("job_posts").select("county, location");
            if (locData) {
                const uniqueLocations = Array.from(new Map(locData.map(item => [`${item.county}-${item.location}`, item])).values());
                setLocations(uniqueLocations.filter(l => l.county && l.location));
            }

            setPrefLoaded(true);
        };
        fetchFilterData();
    }, []);

    useEffect(() => {
        if (selectedCounties.length > 0) {
            const citiesInCounties = [...new Set(locations.filter(l => selectedCounties.includes(l.county)).map(l => l.location))];
            const specialCity = "Okänd plats";
            const sortedCities = citiesInCounties.sort((a, b) => {
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
    }, [selectedCounties, locations]);

    useEffect(() => {
        if (!prefLoaded) return;

        const handler = setTimeout(() => {
            if (searchMode === 'jobs') {
                fetchJobs();
            } else {
                fetchCandidates();
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [selectedCategories, selectedCounties, selectedCity, searchTerm, prefLoaded, searchMode]);

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
                    selectedCounties={selectedCounties}
                    setSelectedCounties={setSelectedCounties}
                    counties={finalSortedCounties}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    cities={availableCities}
                    searchMode={searchMode}
                    setSearchMode={setSearchMode}
                    // Hide candidate search toggle if candidate mode
                    showCandidateToggle={mode === 'recruiter'}
                />

                <section className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-4rem)] bg-muted/5">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <StatsRow />

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {searchMode === 'jobs' ? t.dashboard.title_jobs : t.dashboard.title_candidates}
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        {searchMode === 'jobs'
                                            ? (mode === 'recruiter' ? t.dashboard.subtitle_jobs_recruiter : t.dashboard.subtitle_jobs_candidate)
                                            : t.dashboard.subtitle_candidates}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-background p-1 rounded-lg border shadow-sm">
                                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                                        {isLoading ? "..." : (searchMode === 'jobs' ? jobPosts.length : candidates.length)} {t.dashboard.matches_count}
                                    </span>
                                </div>
                            </div>

                            {/* Active Filter Badges */}
                            {(selectedCounties.length > 0 || selectedCategories.length > 0 || selectedCity || searchTerm) && (
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">{t.dashboard.active_filters}</span>

                                    {selectedCounties.map(county => (
                                        <Badge key={county} variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-indigo-500/10 text-indigo-700 border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                                            {county}
                                            <button onClick={() => setSelectedCounties(selectedCounties.filter(c => c !== county))} className="hover:bg-indigo-500/20 rounded-full p-0.5 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </Badge>
                                    ))}

                                    {searchMode === 'jobs' && selectedCity && (
                                        <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-indigo-500/10 text-indigo-700 border-indigo-500/20">
                                            {selectedCity}
                                            <button onClick={() => setSelectedCity(null)} className="hover:bg-indigo-500/20 rounded-full p-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </Badge>
                                    )}

                                    {searchMode === 'jobs' && selectedCategories.map(cat => (
                                        <Badge key={cat} variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-muted/50 text-muted-foreground border-muted-foreground/20">
                                            {cat}
                                            <button onClick={() => handleCategoryToggle(cat)} className="hover:bg-muted rounded-full p-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </Badge>
                                    ))}

                                    {searchTerm && (
                                        <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
                                            {searchTerm}
                                            <button onClick={() => setSearchTerm("")} className="hover:bg-emerald-500/20 rounded-full p-0.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </Badge>
                                    )}

                                    <button
                                        onClick={() => {
                                            setSelectedCounties([]);
                                            setSelectedCategories([]);
                                            setSelectedCity(null);
                                            setSearchTerm("");
                                        }}
                                        className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-indigo-500 transition-colors ml-2"
                                    >
                                        {t.dashboard.clear_all}
                                    </button>
                                </div>
                            )}
                        </div>

                        {isLoading && (searchMode === 'jobs' ? jobPosts.length === 0 : candidates.length === 0) ? (
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
                                {searchMode === 'jobs' ? (
                                    jobPosts.map((job, index) => (
                                        <JobCard
                                            key={job.id}
                                            job={job as any}
                                            index={index}
                                            initialSaved={savedJobIds.has(job.id)}
                                            mode={mode} // PASS MODE HERE
                                        />
                                    ))
                                ) : (
                                    candidates.map((candidate, index) => (
                                        <CandidateCard
                                            key={candidate.id}
                                            candidate={candidate}
                                            index={index}
                                            isUnlockedInitial={unlockedIds.has(candidate.id)}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {!isLoading && (searchMode === 'jobs' ? jobPosts.length === 0 : candidates.length === 0) && (
                            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                                <p className="text-lg font-medium">{t.dashboard.no_results}</p>
                                <p className="text-sm">{t.dashboard.no_results_desc}</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
