"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n-context";

export function TrustSection() {
    const { t } = useTranslation();

    // Placeholder logic for "Trusted By"
    // In a real app, these would be SVG logos
    const companies = [
        "TechNordic", "SveaGrowth", "WestCoast AI", "NordicValley", "GbgTech"
    ];

    return (
        <section className="py-12 border-y border-border/40 bg-card/30 backdrop-blur-sm">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
                    {t.landing?.trust_badge || "Trusted by recruiting teams at"}
                </p>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company, i) => (
                        <motion.div
                            key={company}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-xl font-bold font-mono text-foreground/60"
                        >
                            {company}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
