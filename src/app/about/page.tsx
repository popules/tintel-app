"use client";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer } from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Globe, Zap, Users } from "lucide-react";

export default function AboutPage() {
    <Rocket className="h-6 w-6" />
                                    </div >
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fast</span>
                                </div >
                            </div >
                        </motion.div >
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/10 p-1"
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center rounded-3xl opacity-20 grayscale brightness-50" />
            <div className="relative h-full w-full flex items-center justify-center">
                <div className="text-center p-8 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-indigo-400 font-mono text-sm mb-2">EST. 2025</p>
                    <p className="text-2xl font-bold">Made with <Heart className="inline h-5 w-5 text-pink-500 mx-1 fill-pink-500 animate-pulse" /> in Gothenburg</p>
                </div>
            </div>
        </motion.div>
                    </div >

        {/* Contact Callout */ }
        < div className = "text-center max-w-2xl mx-auto py-20 border-t border-white/5" >
                        <h2 className="text-3xl font-bold mb-6">Let's build together</h2>
                        <p className="text-muted-foreground mb-10">
                            Whether you're a solo recruiter or an enterprise firm, we'd love to hear from you.
                            Our team is always looking for feedback to make Tintel better.
                        </p>
                        <a
                            href="mailto:hello@tintel.se"
                            className="inline-flex items-center justify-center px-8 h-14 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-95"
                        >
                            Contact hello@tintel.se
                        </a>
                    </div >
                </div >
            </main >

        <Footer />
        </div >
    );
}
