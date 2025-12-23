"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Phone, MapPin, Globe, Linkedin, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CandidateCVPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [candidate, setCandidate] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // or redirect

            const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
            const { data: cand } = await supabase.from("candidates").select("*").eq("id", user.id).single();

            setProfile(prof);
            setCandidate(cand);
            setLoading(false);
        };
        loadData();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!profile || !candidate) return <div>Data not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center print:bg-white print:p-0">
            <style jsx global>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
        }
      `}</style>

            {/* Controls */}
            <div className="fixed bottom-8 right-8 no-print flex gap-2">
                <Button onClick={() => window.print()} className="shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-14 px-8 gap-2">
                    <Printer className="h-5 w-5" />
                    Print / Save as PDF
                </Button>
            </div>

            {/* A4 Page Container */}
            <div className="bg-white shadow-xl w-[210mm] min-h-[297mm] relative flex flex-col print:shadow-none print:w-full">

                {/* Header / Sidebar Layout */}
                <div className="flex flex-1">

                    {/* Left Sidebar (Dark) */}
                    <div className="w-1/3 bg-[#1e293b] text-white p-8 flex flex-col gap-8 print:bg-[#1e293b]">
                        <div className="space-y-2">
                            {/* Avatar */}
                            {profile.avatar_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={profile.avatar_url}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white/10 mb-4"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-indigo-500 flex items-center justify-center text-4xl font-bold mb-4">
                                    {profile.full_name?.[0] || "C"}
                                </div>
                            )}

                            <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Contact</h2>
                            <div className="space-y-3 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="break-all">{profile.email}</span>
                                </div>
                                {candidate.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        <span>{candidate.phone}</span>
                                    </div>
                                )}
                                {candidate.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span>{candidate.location}</span>
                                    </div>
                                )}
                                {candidate.address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span>{candidate.address}</span>
                                    </div>
                                )}
                                {candidate.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 shrink-0" />
                                        <a href={candidate.website} className="hover:text-white truncate">{candidate.website.replace('https://', '')}</a>
                                    </div>
                                )}
                                {candidate.linkedin_url && (
                                    <div className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4 shrink-0" />
                                        <a href={candidate.linkedin_url} className="hover:text-white truncate">LinkedIn Profile</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        {candidate.skills && candidate.skills.length > 0 && (
                            <div className="space-y-3">
                                <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill: string, i: number) => (
                                        <span key={i} className="bg-slate-700/50 px-2 py-1 rounded text-sm text-slate-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="w-2/3 p-10 flex flex-col gap-8">

                        {/* Header Info */}
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">
                                {profile.full_name}
                            </h1>
                            <p className="text-xl text-indigo-600 font-semibold">{candidate.headline}</p>
                        </div>

                        {/* Profile / Summary */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Profile</h3>
                            <p className="text-slate-700 leading-relaxed text-sm">
                                {candidate.bio}
                            </p>
                        </div>

                        {/* Experience (Mocked for now if structured data is missing, using 'years' as context) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b pb-1">Experience</h3>
                            {/* Since we don't have structured work history rows yet, we display a general statement or the years */}
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold text-slate-800">Professional Experience</h4>
                                <span className="text-sm text-slate-500">{candidate.years_of_experience || 0} Years Total</span>
                            </div>
                            <p className="text-sm text-slate-600 italic">
                                Detailed work history available upon request.
                            </p>
                        </div>

                        {/* Footer Brand (Subtle) */}
                        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                            <span>Generated by Tintel Platform</span>
                            <span>{new Date().getFullYear()}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
