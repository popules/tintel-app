"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

// --- Particle Background Component ---
function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        const numParticles = window.innerWidth > 768 ? 100 : 40;
        const connectDistance = 100;
        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        class Particle {
            x: number;
            y: number;
            dx: number;
            dy: number;
            radius: number;
            color: string;

            constructor(x: number, y: number, dx: number, dy: number, radius: number, color: string) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.radius = radius;
                this.color = color;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas!.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas!.height || this.y < 0) this.dy = -this.dy;
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                const radius = Math.random() * 2 + 1;
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                const y = Math.random() * (canvas.height - radius * 2) + radius;
                const dx = (Math.random() - 0.5) * 0.5;
                const dy = (Math.random() - 0.5) * 0.5;
                particles.push(new Particle(x, y, dx, dy, radius, "rgba(255, 255, 255, 0.3)"));
            }
        };

        const connect = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = Math.sqrt(
                        Math.pow(particles[a].x - particles[b].x, 2) +
                        Math.pow(particles[a].y - particles[b].y, 2)
                    );

                    if (distance < connectDistance) {
                        ctx!.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectDistance})`;
                        ctx!.lineWidth = 0.2;
                        ctx!.beginPath();
                        ctx!.moveTo(particles[a].x, particles[a].y);
                        ctx!.lineTo(particles[b].x, particles[b].y);
                        ctx!.stroke();
                    }
                }
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => p.update());
            connect();
        };

        init();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
}

// --- Landing Page Component ---
export default function LandingPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            console.log("Email submitted:", email);
            setSubmitted(true);
        }
    };

    return (
        <div className="relative w-full h-screen bg-gray-900 text-white font-sans overflow-hidden">
            <ParticleBackground />

            {/* Header / Nav */}
            <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">tintel</div>
                <div className="flex gap-4">
                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Log in</Link>
                    <Link href="/signup" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium backdrop-blur-sm border border-white/10">Sign up</Link>
                </div>
            </nav>

            <main className="relative w-full h-full flex items-center justify-center p-4">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-white/10 bg-gray-900/60 backdrop-blur-xl"
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
                        tintel
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl mb-8 font-light">
                        Redefining intelligence in the talent sector.
                    </p>
                    <p className="text-gray-400 text-md md:text-lg mb-10 max-w-md mx-auto">
                        Our platform is launching soon. Join the waitlist to be the first to know when we go live.
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
                            >
                                Notify Me
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg"
                        >
                            Thanks for joining! We'll be in touch.
                        </motion.div>
                    )}

                    <div className="mt-12 flex justify-center space-x-6 text-gray-500">
                        {/* Social Icons (SVGs) */}
                        <a href="#" className="hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.55.15-1.141.22-1.75.22-.303 0-.6-.03-.89-.08.632 1.9 2.448 3.28 4.6 3.315-1.714 1.34-3.87 2.14-6.22 2.14-.4 0-.79-.02-1.18-.07 2.2 1.4 4.83 2.22 7.64 2.22 9.16 0 14.17-7.6 14.17-14.17 0-.21 0-.43-.02-.63.98-.7 1.82-1.57 2.5-2.58z" /></svg>
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
