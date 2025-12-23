"use client";

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Briefcase, MapPin, Clock, Wand2, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { SWEDISH_COUNTIES } from '@/lib/data/counties'

export default function CandidateOnboardingPage() {
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Form State
    const [headline, setHeadline] = useState('')
    const [location, setLocation] = useState('')
    const [experience, setExperience] = useState('')
    const [bio, setBio] = useState('')
    const [skills, setSkills] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("candidates")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                // Populate form for editing
                setIsEditing(true);
                setHeadline(data.headline || '');
                setLocation(data.location || '');
                setExperience(data.experience_years ? String(data.experience_years) : '');
                setSkills(data.skills?.join(', ') || '');
                setBio(data.bio || '');
                setPhone(data.phone || '');
            }
        };
        fetchProfile();
    }, [supabase]);

    const handleMagicFill = async () => {
        if (!headline) return;
        setAiLoading(true);

        // Simulating AI generation based on heuristic keywords
        setTimeout(() => {
            const lowerHeadline = headline.toLowerCase();
            let generatedBio = `Experienced ${headline} with a strong background in the field. Dedicated to delivering high-quality results and working efficiently within teams.`;
            let generatedSkills = "Teamwork, Problem Solving, Safety Protocols";

            if (lowerHeadline.includes("snickare") || lowerHeadline.includes("carpenter")) {
                generatedBio = "Skilled Carpenter with expertise in framing, finish carpentry, and reading blueprints. Precision-oriented and committed to safety and quality craftsmanship.";
                generatedSkills = "Framing, Finish Carpentry, Blueprint Reading, Woodworking, Safety Compliance";
            } else if (lowerHeadline.includes("truck") || lowerHeadline.includes("forklift")) {
                generatedBio = "Certified Forklift Operator with valid license and reliable track record in active warehouse environments. Focused on efficiency and safety regulations.";
                generatedSkills = "Forklift Operation, Warehouse Logistics, Safety Management, Inventory Control";
            } else if (lowerHeadline.includes("lager") || lowerHeadline.includes("warehouse")) {
                generatedBio = "Reliable Warehouse Worker experienced in picking, packing, and inventory management. Physically fit and accustomed to fast-paced logistics operations.";
                generatedSkills = "Picking & Packing, Inventory Management, Pallet Jack, Logistics";
            } else if (lowerHeadline.includes("säljare") || lowerHeadline.includes("sales")) {
                generatedBio = "Results-driven Sales Representative with a proven history of exceeding targets. Excellent communicator skilled in negotiation and building client relationships.";
                generatedSkills = "B2B Sales, CRM, Negotiation, Account Management, Cold Calling";
            }

            setBio(generatedBio);
            setSkills(generatedSkills);
            setAiLoading(false);
        }, 1200);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError("You must be logged in.")
                setLoading(false)
                return
            }

            const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0)

            const payload = {
                id: user.id,
                headline,
                location,
                experience_years: parseInt(experience) || 0,
                skills: skillsArray,
                bio,
                phone, // Added phone
                is_open: true,
            }

            const { error: upsertError } = await supabase
                .from('candidates')
                .upsert(payload)

            if (upsertError) {
                setError(upsertError.message)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error('Error saving profile:', err)
            setError('An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-6 text-center"
                >
                    <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                        <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Profile Created!</h2>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push('/candidate/dashboard')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Go to Dashboard
                        </Button>
                        <Button onClick={() => window.print()} className="bg-white text-black hover:bg-white/90">
                            Download CV
                        </Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl text-white font-black tracking-tighter mb-2">Build Your Smooth Profile</h1>
                    <p className="text-indigo-200/60 text-lg">
                        Tell us what you do. We'll help recruiters find you.
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="pb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-white text-xl">Professional Details</CardTitle>
                                    <CardDescription className="text-indigo-200/50 mt-1">
                                        This is what companies will see when they search for talent.
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                    <Sparkles className="mr-1.5 h-3 w-3" />
                                    AI Powered
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="grid gap-8">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Headline */}
                            <div className="grid gap-3">
                                <Label htmlFor="headline" className="text-white">Headline / Role</Label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="headline"
                                        placeholder="e.g. Senior Carpenter"
                                        className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500/50"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={handleMagicFill}
                                        disabled={!headline || aiLoading}
                                        className="absolute right-2 top-2 h-8 bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                                    >
                                        {aiLoading ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                        ) : (
                                            <Wand2 className="h-3 w-3 mr-1" />
                                        )}
                                        {aiLoading ? "Generating..." : "Magic Fill"}
                                    </Button>
                                </div>
                                <p className="text-xs text-indigo-200/40">Enter your role and click 'Magic Fill' to auto-generate your bio.</p>
                            </div>

                            {/* Location & Experience */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="location" className="text-white">Location</Label>
                                    <Select value={location} onValueChange={setLocation} required>
                                        <SelectTrigger className="h-12 bg-black/20 border-white/10 text-white focus:ring-indigo-500/50 pl-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-indigo-300" />
                                                <SelectValue placeholder="Select County" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {SWEDISH_COUNTIES.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="experience" className="text-white">Years of Experience</Label>
                                    <div className="relative group">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
                                        <Input
                                            id="experience"
                                            type="number"
                                            placeholder="5"
                                            className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500/50"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="grid gap-3">
                                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+46 70 123 45 67"
                                        className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500/50"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="grid gap-3">
                                <Label htmlFor="skills" className="text-white">Skills & Certificates</Label>
                                <Textarea
                                    id="skills"
                                    placeholder="React, TypeScript, Node.js"
                                    className="min-h-[80px] bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500/50 resize-none"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                />
                            </div>

                            {/* Bio */}
                            <div className="grid gap-3">
                                <Label htmlFor="bio" className="text-white">Professional Summary</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Briefly describe your background..."
                                    className="min-h-[120px] bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-indigo-500/50 resize-none"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                        </CardContent>
                        <CardFooter className="pt-8">
                            <Button className="w-full h-12 text-lg font-bold bg-white text-black hover:bg-white/90" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Update Profile" : "Create Profile"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
