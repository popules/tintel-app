"use client";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterSidebarProps {
    categories: string[]
    selectedCategories: string[]
    handleCategoryToggle: (category: string) => void
    selectedCounty: string | null
    setSelectedCounty: (val: string | null) => void
    counties: string[]
    selectedCity: string | null
    setSelectedCity: (val: string | null) => void
    cities: string[]
}

export function FilterSidebar({
    categories,
    selectedCategories,
    handleCategoryToggle,
    selectedCounty,
    setSelectedCounty,
    counties,
    selectedCity,
    setSelectedCity,
    cities
}: FilterSidebarProps) {
    return (
        <aside className="hidden lg:flex w-72 flex-col gap-6 border-r bg-muted/10 p-6 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <div className="space-y-1">
                <h3 className="font-semibold text-lg tracking-tight">Filters</h3>
                <p className="text-sm text-muted-foreground">Refine your job search</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Location</Label>

                    <Select value={selectedCounty || "all"} onValueChange={(v) => setSelectedCounty(v === "all" ? null : v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select County" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Counties</SelectItem>
                            {counties.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedCity || "all"} onValueChange={(v) => setSelectedCity(v === "all" ? null : v)} disabled={!selectedCounty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {cities.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Categories</Label>
                    <ScrollArea className="h-64 pr-4">
                        <div className="space-y-2">
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
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </aside>
    )
}
