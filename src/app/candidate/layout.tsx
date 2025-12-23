import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/30">
            <main className="relative flex min-h-screen flex-col">
                {children}
            </main>
        </div>
    );
}
