"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SwedenMapProps {
    selectedCounties: string[];
    onToggleCounty: (county: string) => void;
    className?: string;
}

/**
 * High-end Interactive SVG Map of Sweden
 * Simplified paths for performance and clean aesthetic
 */
export function SwedenMap({ selectedCounties, onToggleCounty, className = "" }: SwedenMapProps) {
    // SVG Paths for Swedish Counties (Län)
    // These are simplified representative paths for a clean UI aesthetic
    const counties = [
        { id: "Blekinge län", name: "Blekinge", path: "M 320 620 L 335 615 L 345 625 L 330 635 Z" },
        { id: "Dalarnas län", name: "Dalarna", path: "M 220 450 L 260 440 L 280 470 L 250 510 L 210 490 Z" },
        { id: "Gotlands län", name: "Gotland", path: "M 390 560 L 400 555 L 405 575 L 395 580 Z" },
        { id: "Gävleborgs län", name: "Gävleborg", path: "M 260 440 L 300 430 L 320 460 L 280 470 Z" },
        { id: "Hallands län", name: "Halland", path: "M 260 610 L 275 605 L 285 625 L 270 630 Z" },
        { id: "Jämtlands län", name: "Jämtland", path: "M 210 330 L 270 310 L 290 380 L 230 410 Z" },
        { id: "Jönköpings län", name: "Jönköping", path: "M 280 570 L 310 575 L 315 605 L 285 600 Z" },
        { id: "Kalmar län", name: "Kalmar", path: "M 320 575 L 345 565 L 355 615 L 330 610 Z" },
        { id: "Kronobergs län", name: "Kronoberg", path: "M 290 600 L 320 610 L 325 625 L 295 620 Z" },
        { id: "Norrbottens län", name: "Norrbotten", path: "M 280 50 L 380 90 L 410 210 L 300 230 Z" },
        { id: "Skåne län", name: "Skåne", path: "M 270 640 L 320 635 L 310 670 L 275 665 Z" },
        { id: "Stockholms län", name: "Stockholm", path: "M 350 500 L 375 495 L 380 520 L 355 525 Z" },
        { id: "Södermanlands län", name: "Södermanland", path: "M 325 510 L 350 500 L 360 525 L 335 535 Z" },
        { id: "Uppsala län", name: "Uppsala", path: "M 330 475 L 360 470 L 370 495 L 340 500 Z" },
        { id: "Värmlands län", name: "Värmland", path: "M 210 490 L 250 510 L 240 545 L 200 535 Z" },
        { id: "Västerbottens län", name: "Västerbotten", path: "M 270 230 L 370 210 L 400 310 L 290 330 Z" },
        { id: "Västernorrlands län", name: "Västernorrland", path: "M 290 330 L 340 310 L 360 410 L 310 430 Z" },
        { id: "Västmanlands län", name: "Västmanland", path: "M 290 490 L 325 485 L 335 510 L 305 515 Z" },
        { id: "Västra Götalands län", name: "Västra Götaland", path: "M 200 535 L 260 540 L 280 600 L 230 605 Z" },
        { id: "Örebro län", name: "Örebro", path: "M 260 510 L 290 505 L 305 540 L 270 545 Z" },
        { id: "Östergötlands län", name: "Östergötland", path: "M 310 535 L 345 530 L 355 565 L 320 575 Z" },
    ];

    return (
        <div className={`relative ${className}`}>
            <svg
                viewBox="150 20 300 660"
                className="w-full h-full drop-shadow-2xl"
                style={{ filter: "drop-shadow(0px 0px 40px rgba(99, 102, 241, 0.15))" }}
            >
                {counties.map((county) => {
                    const isSelected = selectedCounties.includes(county.id);
                    return (
                        <motion.path
                            key={county.id}
                            d={county.path}
                            initial={false}
                            animate={{
                                fill: isSelected ? "rgba(99, 102, 241, 0.8)" : "rgba(30, 41, 59, 0.4)",
                                stroke: isSelected ? "rgba(99, 102, 241, 1)" : "rgba(148, 163, 184, 0.3)",
                                scale: isSelected ? 1.02 : 1,
                            }}
                            whileHover={{
                                fill: isSelected ? "rgba(99, 102, 241, 0.9)" : "rgba(99, 102, 241, 0.2)",
                                stroke: "rgba(99, 102, 241, 0.5)",
                                scale: 1.03,
                                transition: { duration: 0.2 }
                            }}
                            onClick={() => onToggleCounty(county.id)}
                            className="cursor-pointer transition-colors duration-300"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        >
                            <title>{county.name}</title>
                        </motion.path>
                    );
                })}
            </svg>
            {/* Legend / Overlay info */}
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md p-2 rounded-lg border border-muted text-[10px] font-bold text-muted-foreground uppercase tracking-widest pointer-events-none">
                {selectedCounties.length} Regions Active
            </div>
        </div>
    );
}
