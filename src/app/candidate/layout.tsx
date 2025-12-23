import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/30">
            {/* Candidate Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                        <span className="text-xl font-bold tracking-tight">tintel</span>
                        <Badge variant="secondary" className="ml-2 text-[10px] uppercase tracking-widest">
                            Candidate
                        </Badge>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            For Recruiters
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="relative flex min-h-[calc(100vh-4rem)] flex-col">
                {children}
            </main>
        </div>
    );
}
