import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";

// Define a type for our job post data for better code safety
type JobPost = {
  id: string;
  title: string;
  company: string;
  city: string;
  created_at: string;
  webbplatsurl: string; // Corrected from original_url
};

// This function now fetches data directly on the server
async function getJobs() {
  const { data: jobs, error } = await supabase
    .from("job_posts")
    .select("*")
    .order("created_at", { ascending: false }) // Show newest jobs first
    .limit(20); // Get the latest 20 jobs

  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
  
  // We can remove the console.log now that we've found the bug
  // console.log("Fetched jobs data:", jobs);

  return jobs;
}

// The main page component is now async to await the data
export default async function Home() {
  const jobPosts: JobPost[] = await getJobs();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur-sm md:px-6">
        <h1 className="text-xl font-bold">tintel</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 w-full p-4 md:p-6">
        <div className="grid w-full gap-6 md:grid-cols-[280px_1fr]">
          {/* Sidebar for Filters */}
          <aside className="hidden md:flex">
            <Card className="w-full h-fit">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your search</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Category filters will go here.</p>
              </CardContent>
            </Card>
          </aside>

          {/* Job Listings Section */}
          <section className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Explorer</CardTitle>
                <CardDescription>
                  Showing the latest {jobPosts.length} jobs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPosts.map((job) => (
                    <a
                      key={job.id}
                      href={job.webbplatsurl} // Corrected from original_url
                      target="_blank" // Opens link in a new tab
                      rel="noopener noreferrer"
                      className="block" // Makes the whole area of the link clickable
                    >
                      <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary">
                        <CardHeader>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>
                            {job.company} - {job.city}
                          </CardDescription>
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