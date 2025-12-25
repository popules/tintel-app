"use client";

import { motion } from "framer-motion";

const COMPANIES = [
    "Volvo Group", "Spotify", "Northvolt", "IKEA", "Ericsson", "Scania",
    "Klarna", "H&M", "Polestar", "Vattenfall", "Skanska", "Sandvik",
    "Atlas Copco", "SAAB", "Tetra Pak", "Husqvarna", "Electrolux"
];

const ROLES = [
    "Frontend Developer", "Project Manager", "Sales Representative",
    "Machine Operator", "nurse", "Truck Driver", "Electrical Engineer",
    "Customer Support", "Accountant", "HR Specialist", "Welder",
    "Store Manager", "Data Analyst", "UX Designer"
];

// Shuffle and combine for randomness
const TICKER_ITEMS = [...Array(10)].map((_, i) => ({
    id: i,
    text: `${ROLES[Math.floor(Math.random() * ROLES.length)]} at ${COMPANIES[Math.floor(Math.random() * COMPANIES.length)]}`,
    type: Math.random() > 0.5 ? 'hiring' : 'joined'
}));

export function LiveTicker() {
    return (
        <div className="w-full bg-indigo-950/30 border-y border-white/5 py-3 overflow-hidden flex items-center relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="flex gap-8 items-center animate-infinite-scroll min-w-full">
                {/* Duplicated for seamless loop */}
                {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-2 whitespace-nowrap opacity-70 hover:opacity-100 transition-opacity">
                        <div className={`h-2 w-2 rounded-full ${item.type === 'hiring' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
                        <span className="text-sm font-mono text-muted-foreground">
                            <span className="font-bold text-foreground">{item.type === 'hiring' ? 'New Job:' : 'Candidate Matched:'}</span> {item.text}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
        </div>
    );
}
