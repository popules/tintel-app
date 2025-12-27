"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ExportButtonProps {
    candidates: any[]; // Or specific type
}

export function ExportButton({ candidates }: ExportButtonProps) {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleExport = async () => {
        setLoading(true);

        // 1. Check Pro Status (Client-side pre-check, but data is already there so it's mostly UX)
        // Ideally we check server-side but for client-side export of ALREADY FETCHED data, 
        // we can just check the profile again or assume the parent component checked.
        // Let's do a quick check to ensure they are allowed to "Download".

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("You must be logged in.");
            setLoading(false);
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_tier !== 'pro' && profile?.subscription_tier !== 'enterprise') {
            toast.error("Upgrade to Pro to export candidate data.", {
                action: {
                    label: "Upgrade",
                    onClick: () => window.location.href = "/pricing"
                }
            });
            setLoading(false);
            return;
        }

        try {
            // 2. Convert to CSV
            const headers = ["Name", "Role", "Company", "Location", "Experience", "Skills", "LinkedIn", "Email"];
            const csvRows = [headers.join(",")];

            candidates.forEach(c => {
                const row = [
                    `"${c.full_name || 'Candidate'}"`,
                    `"${c.role || ''}"`,
                    `"${c.company || ''}"`,
                    `"${c.location || ''}"`,
                    `"${c.experience_years || ''}"`,
                    `"${(c.skills || []).join(', ')}"`,
                    `"${c.linkedin_url || ''}"`,
                    `"${c.email || ''}"`
                ];
                csvRows.push(row.join(","));
            });

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
            const encodedUri = encodeURI(csvContent);

            // 3. Download
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `tintel_candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Export successful!");

        } catch (error) {
            console.error(error);
            toast.error("Failed to export.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={loading || candidates.length === 0}
            className="gap-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 text-xs"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            Export CSV
        </Button>
    );
}
