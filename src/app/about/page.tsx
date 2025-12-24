import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Globe, Zap, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                <div className="container px-4 mx-auto text-center relative z-10">
                    <Badge variant="outline" className="mb-4 text-indigo-600 border-indigo-200 bg-indigo-50">Our Mission</Badge>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
                        Intelligence for main street.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        We are democratizing access to enterprise-grade recruitment intelligence. Tintel gives independent recruiters and small teams the same AI superpowers as the tech giants.
                    </p>
                </div>
            </section>

            {/* Gothenburg Section */}
            <section className="py-20 bg-muted/30 border-y border-border/50">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-3 md:skew-y-0 rotate-2 transition-transform hover:rotate-0">
                            {/* Placeholder for Gbg Image - using a gradient for now */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                                <span className="text-9xl opacity-20 select-none">🇸🇪</span>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white">
                                <p className="font-semibold">Designed in Gothenburg</p>
                                <p className="text-xs opacity-80">Coordinates: 57.7089° N, 11.9746° E</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Built in Gothenburg. <br /><span className="text-indigo-600">Built for the World.</span></h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Tintel was born on the rainy west coast of Sweden. We value pragmatism, design excellence, and transparent engineering.
                                Just like our hometown, we believe in building things that last and communities that support each other.
                            </p>
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex flex-col gap-2 p-4 bg-background rounded-lg border shadow-sm">
                                    <Heart className="h-5 w-5 text-red-500" />
                                    <span className="font-semibold">Crafted with Care</span>
                                    <span className="text-xs text-muted-foreground">Every pixel and line of code matters to us.</span>
                                </div>
                                <div className="flex flex-col gap-2 p-4 bg-background rounded-lg border shadow-sm">
                                    <Globe className="h-5 w-5 text-indigo-500" />
                                    <span className="font-semibold">Global Ambition</span>
                                    <span className="text-xs text-muted-foreground">Starting in Sweden, expanding everywhere.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-16">Why we exist</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Speed wins</h3>
                            <p className="text-muted-foreground">In recruitment, being first often means being best. Our tools are designed for velocity.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">People first</h3>
                            <p className="text-muted-foreground">AI shouldn't replace humans; it should remove the boring parts so humans can connect.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Open Data</h3>
                            <p className="text-muted-foreground">We believe job market data should be transparent and accessible to everyone.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-indigo-600 text-white text-center">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Join the movement</h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                        Ready to upgrade your recruitment workflow? Join thousands of recruiters who trust Tintel.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="font-semibold">
                        <Link href="/signup">Get Started Free</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
