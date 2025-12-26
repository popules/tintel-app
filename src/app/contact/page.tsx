"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Mail, ArrowRight, MessageCircle, MapPin } from "lucide-react";

export default function ContactPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#030014] text-white selection:bg-purple-500/30 overflow-hidden flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 relative">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-16"
                    >
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                            {t.public.contact.badge}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                            {t.public.contact.title}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {t.public.contact.subtitle}
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Contact Info Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-sm relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                                    <Mail className="w-6 h-6 text-purple-400" />
                                </div>

                                <h3 className="text-2xl font-semibold mb-2">{t.public.contact.email_label}</h3>
                                <p className="text-gray-400 mb-8">
                                    Drop isn't just for features. We read every message.
                                </p>

                                <a
                                    href={`mailto:${t.public.contact.email_value}`}
                                    className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 hover:opacity-80 transition-opacity inline-flex items-center gap-2"
                                >
                                    {t.public.contact.email_value}
                                    <ArrowRight className="w-6 h-6 text-purple-400" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Additional Info / "Office" */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/20 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Göteborg HQ</h3>
                                        <p className="text-gray-400">
                                            Designed and built on the west coast of Sweden.
                                            <br />
                                            57.7089° N, 11.9746° E
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-white/20 transition-colors flex-1 flex flex-col justify-center text-center">
                                <h3 className="font-semibold text-white mb-2">{t.public.contact.social_label}</h3>
                                <p className="text-sm text-gray-500 mb-4">Follow our journey building the future of recruitment.</p>
                                <div className="flex justify-center gap-4">
                                    <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                                        {/* Simple text or icon placeholders as we don't have real socials yet */}
                                        <span className="font-bold text-sm">Li</span>
                                    </a>
                                    <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                                        <span className="font-bold text-sm">X</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
