"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n-context";

// This component will fetch and display the broad job categories.
// For now, the buttons don't do anything. We will add that logic next.
export default function CategorySidebar() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function runs once when the component loads.
    async function fetchCategories() {
      try {
        setLoading(true);
        // It calls the new API endpoint we just created.
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error("Failed to load category data.");
        }
        const data = await res.json();
        // We save the list of categories to our state.
        setCategories(data.categories || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []); // The empty array means this effect runs only once.

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="rounded-2xl glass-card p-4 sticky top-20">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          {t.dashboard_filters.categories}
        </h3>

        {/* Display a loading message while we fetch data */}
        {loading && <div className="text-sm text-gray-500 animate-pulse">{t.dashboard.loading}</div>}

        {/* Display an error message if the fetch fails */}
        {error && <div className="text-sm text-red-400">{t.dashboard.error}</div>}

        {/* Once loaded, display the categories as clickable chips */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button key={category} className="chip">
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
