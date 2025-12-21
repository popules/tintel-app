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
        <aside className="hidden lg:flex w-72 flex-col gap-6 border-r bg-background/95 backdrop-blur-xl p-6 h-[calc(100vh-4rem)] sticky top-16 shadow-[1px_0_20px_rgba(0,0,0,0.05)]">
            <div className="space-y-1 shrink-0">
                <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
                    <span className="bg-indigo-500/10 text-indigo-500 p-1.5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                    </span>
                    Filters
                </h3>
                <p className="text-xs text-muted-foreground pl-1">Refine your job search</p>
            </div>

            <div className="space-y-5 flex-1 flex flex-col min-h-0">
                {/* Location Section */}
                <div className="space-y-3 shrink-0">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 pl-1">Location</Label>

                    <div className="space-y-2">
                        <Select value={selectedCounty || "all"} onValueChange={(v) => setSelectedCounty(v === "all" ? null : v)}>
                            <SelectTrigger className="h-10 bg-muted/40 border-muted-foreground/20 focus:ring-indigo-500/20 transition-all hover:bg-muted/60 hover:border-indigo-500/30">
                                <SelectValue placeholder="Select County" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                <SelectItem value="all">All Counties</SelectItem>
                                {counties.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedCity || "all"} onValueChange={(v) => setSelectedCity(v === "all" ? null : v)} disabled={!selectedCounty}>
                            <SelectTrigger className="h-10 bg-muted/40 border-muted-foreground/20 focus:ring-indigo-500/20 transition-all hover:bg-muted/60 hover:border-indigo-500/30">
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                <SelectItem value="all">All Cities</SelectItem>
                                {cities.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Categories Section (Scrollable) */}
                <div className="flex flex-col flex-1 min-h-0 gap-3">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 pl-1">Categories</Label>

                    <div className="flex-1 min-h-0 border rounded-xl bg-muted/20 overflow-hidden">
                        <ScrollArea className="h-full w-full">
                            <div className="p-2 space-y-1">
                                {categories.map((cat) => {
                                    const isSelected = selectedCategories.includes(cat);
                                    return (
                                        <div
                                            key={cat}
                                            onClick={() => handleCategoryToggle(cat)}
                                            className={`
                                                group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent
                                                ${isSelected
                                                    ? 'bg-indigo-500/10 border-indigo-500/20 shadow-sm'
                                                    : 'hover:bg-muted hover:border-border/50'}
                                            `}
                                        >
                                            <Checkbox
                                                id={cat}
                                                checked={isSelected}
                                                onCheckedChange={() => handleCategoryToggle(cat)}
                                                className={`
                                                    transition-all duration-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600
                                                    ${isSelected ? 'border-indigo-500' : 'border-muted-foreground/40 group-hover:border-indigo-400'}
                                                `}
                                            />
                                            <label
                                                htmlFor={cat}
                                                className={`
                                                    text-sm leading-none cursor-pointer flex-1 line-clamp-1
                                                    ${isSelected ? 'font-semibold text-indigo-950 dark:text-indigo-100' : 'text-muted-foreground group-hover:text-foreground'}
                                                `}
                                            >
                                                {cat}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </aside>
    )
}
