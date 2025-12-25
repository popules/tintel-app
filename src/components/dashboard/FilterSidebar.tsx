"use client";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SwedenMap } from "./SwedenMap"
import { Map as MapIcon, List, Radar, Briefcase, Users } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FilterSidebarProps {
    categories: string[]
    selectedCategories: string[]
    handleCategoryToggle: (category: string) => void
    selectedCounties: string[]
    setSelectedCounties: (val: string[]) => void
    counties: string[]
    selectedCity: string | null
    setSelectedCity: (val: string | null) => void
    cities: string[]
    searchMode: 'jobs' | 'people'
    setSearchMode: (mode: 'jobs' | 'people') => void
    showCandidateToggle?: boolean
}

export function FilterSidebar({
    categories,
    selectedCategories,
    handleCategoryToggle,
    selectedCounties,
    setSelectedCounties,
    counties,
    selectedCity,
    setSelectedCity,
    cities,
    searchMode,
    setSearchMode,
    showCandidateToggle = true
}: FilterSidebarProps) {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const toggleCounty = (county: string) => {
        const isSelected = selectedCounties.includes(county);
        const newCounties = isSelected
            ? selectedCounties.filter(c => c !== county)
            : [...selectedCounties, county];
        setSelectedCounties(newCounties);
    };

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

            {/* Search Mode Toggle (Jobs vs People) - Conditionally Rendered */}
            {showCandidateToggle && (
                <div className="bg-muted/40 p-1 rounded-lg border border-muted-foreground/10 shrink-0 grid grid-cols-2 gap-1">
                    <button
                        onClick={() => setSearchMode('jobs')}
                        className={`flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${searchMode === 'jobs' ? 'bg-background text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Briefcase className="h-3 w-3" />
                        Find Jobs
                    </button>
                    <button
                        onClick={() => setSearchMode('people')}
                        className={`flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${searchMode === 'people' ? 'bg-background text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Users className="h-3 w-3" />
                        Find People
                    </button>
                </div>
            )}

            <div className="flex bg-muted/40 p-1 rounded-lg border border-muted-foreground/10 shrink-0">
                <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-background text-indigo-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <List className="h-3 w-3" />
                    List
                </button>
                <button
                    onClick={() => setViewMode('map')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'map' ? 'bg-background text-indigo-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Radar className="h-3 w-3" />
                    Radar
                </button>
            </div>

            <div className="space-y-5 flex-1 flex flex-col min-h-0">
                {/* Location Section */}
                <div className="space-y-3 shrink-0 flex flex-col min-h-0">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 pl-1">Target Counties</Label>

                    <div className="flex-1 min-h-[160px] border rounded-xl bg-muted/20 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' ? (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="h-full"
                                >
                                    <ScrollArea className="h-[160px] w-full">
                                        <div className="p-2 space-y-1">
                                            {counties.map((county) => {
                                                const isSelected = selectedCounties.includes(county);
                                                return (
                                                    <div
                                                        key={county}
                                                        onClick={() => toggleCounty(county)}
                                                        className={`
                                                            group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent
                                                            ${isSelected
                                                                ? 'bg-indigo-500/10 border-indigo-500/20'
                                                                : 'hover:bg-muted hover:border-border/50'}
                                                        `}
                                                    >
                                                        <Checkbox
                                                            id={county}
                                                            checked={isSelected}
                                                            onCheckedChange={() => { }} // Handled by div onClick
                                                            className={`
                                                                h-3.5 w-3.5 transition-all duration-200 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600
                                                                ${isSelected ? 'border-indigo-500' : 'border-muted-foreground/40 group-hover:border-indigo-400'}
                                                            `}
                                                        />
                                                        <label className={`text-xs leading-none cursor-pointer flex-1 line-clamp-1 ${isSelected ? 'font-semibold text-indigo-950 dark:text-indigo-100' : 'text-muted-foreground'}`}>
                                                            {county}
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </ScrollArea>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="map"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="h-[160px] w-full flex items-center justify-center p-2"
                                >
                                    <SwedenMap
                                        selectedCounties={selectedCounties}
                                        onToggleCounty={toggleCounty}
                                        className="h-full w-auto"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Select value={selectedCity || "all"} onValueChange={(v) => setSelectedCity(v === "all" ? null : v)} disabled={selectedCounties.length === 0}>
                        <SelectTrigger className="h-9 bg-muted/40 border-muted-foreground/20 focus:ring-indigo-500/20 transition-all hover:bg-muted/60 hover:border-indigo-500/30 text-xs">
                            <SelectValue placeholder="Filter by City" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            <SelectItem value="all">All Cities</SelectItem>
                            {cities.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
