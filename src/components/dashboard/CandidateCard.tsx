"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Briefcase, Sparkles, User, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Candidate {
    id: string;
    headline: string;
    location: string;
    experience_years: number;
    bio: string;
    skills: string[];
    is_open: boolean;
    created_at: string;
}

interface CandidateCardProps {
    candidate: Candidate;
    index: number;
}

export function CandidateCard({ candidate, index }: CandidateCardProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUnlock = async () => {
        setLoading(true);
        try {
            // Dynamically import to keep client bundle clean if needed, or just use direct import if 'use server' is handled correctly.
            // Since we are in a client component, we import the action.
            const { unlockCandidateProfile } = await import('@/app/actions/unlock-candidate');
            const result = await unlockCandidateProfile();

            if (result.success) {
                setIsUnlocked(true);
                // toast.success(`Profile Unlocked! ${result.remainingCredits} credits remaining.`); 
            } else {
                if (result.error === 'insufficient_credits') {
                    alert("You have run out of credits! Please upgrade to continue unlocking profiles.");
                    // Ideally open a "Pricing/Upgrade" modal here
                } else {
                    alert("Something went wrong. Please try again.");
                }
            }
        } catch (e) {
            console.error(e);
            alert("Connection error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="h-full"
        >
            <Card className={`h-full flex flex-col overflow-hidden border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 group ${isUnlocked ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20' : 'hover:shadow-lg hover:shadow-indigo-500/10'}`}>
                {isUnlocked && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                )}
                {!isUnlocked && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <CardHeader className="pb-3 pt-5 px-5 relative">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${isUnlocked ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-muted border-border text-muted-foreground'}`}>
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight transition-colors">
                                    {isUnlocked ? "John Doe" : (candidate.headline || "Unspecified Role")}
                                </h3>

                                {isUnlocked && <p className="text-xs font-medium text-indigo-600 mb-0.5">{candidate.headline}</p>}

                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {candidate.location || "Remote"}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {candidate.experience_years}y Exp
                                    </span>
                                </div>
                            </div>
                        </div>

                        {candidate.is_open && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] uppercase font-bold tracking-wider">
                                Available
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="px-5 pb-4 flex-1">
                    <div className="relative">
                        <p className={`text-sm text-muted-foreground line-clamp-3 mb-4 ${!isUnlocked && 'blur-[2px] select-none opacity-70'}`}>
                            {isUnlocked ? candidate.bio : "This candidate represents a strong match for roles in this sector. Unlock full profile to view detailed biography, work history, availability and contact information."}
                        </p>
                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-background/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-border/50 shadow-sm text-muted-foreground">
                                    Preview
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {candidate.skills?.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-background/50 text-[10px] font-medium border-border/60">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className={`px-5 py-4 border-t border-border/40 mt-auto flex gap-3 transition-colors ${isUnlocked ? 'bg-indigo-500/5' : 'bg-muted/20'}`}>
                    {isUnlocked ? (
                        <div className="flex gap-2 w-full">
                            <Button className="flex-1 bg-white hover:bg-gray-50 text-foreground border border-input shadow-sm h-9 text-xs font-semibold">
                                View CV
                            </Button>
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs font-semibold">
                                Contact
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleUnlock}
                            disabled={loading}
                            className="w-full bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-indigo-500/20 h-9 text-xs font-semibold uppercase tracking-wider group-hover:scale-[1.02] transition-transform"
                        >
                            {loading ? <span className="animate-spin mr-2">⏳</span> : <Sparkles className="mr-2 h-3 w-3" />}
                            {loading ? "Unlocking..." : "Unlock Profile (1 Credit)"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
