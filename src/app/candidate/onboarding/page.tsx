"use client";

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Sparkles, Briefcase, MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export default function CandidateOnboardingPage() {
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Not logged in? Redirect to signup/login
                // router.push("/candidate/login");
                return;
            }

            const { data, error } = await supabase
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
            }
        };
        fetchProfile();
    }, [supabase]); // Added supabase to dependency array for completeness

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
                is_open: true, // Default to open on creation/update? or keep existing state? Logic below handles "upsert" effectively.
            }

            const { error: upsertError } = await supabase
                .from('candidates')
                .upsert(payload)

            if (upsertError) {
                setError(upsertError.message)
            } else {
                setSuccess(true)
                // Short delay then redirect
                setTimeout(() => {
                    router.push('/candidate/dashboard')
                }, 1500)
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
            <div className="container max-w-md py-20 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Profile Created!</h2>
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Build Your Smooth Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Tell us what you do. We'll help recruiters find you.
                    </p>
                </div>

                <Card className="border-indigo-500/10 shadow-lg shadow-indigo-500/5">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Professional Details</CardTitle>
                            <CardDescription>
                                This is what companies will see when they search for talent.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">

                            <div className="grid gap-2">
                                <Label htmlFor="headline">Headline / Role</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="headline"
                                        placeholder="e.g. Senior Carpenter, Forklift Driver"
                                        className="pl-9"
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">The main title on your profile card.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            placeholder="Stockholm"
                                            className="pl-9"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="experience">Years of Experience</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="experience"
                                            type="number"
                                            placeholder="5"
                                            className="pl-9"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="skills">Skills & Certificates</Label>
                                <Textarea
                                    id="skills"
                                    placeholder="React, TypeScript, Node.js"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground">Comma separated</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Short Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Briefly describe your background..."
                                    className="min-h-[100px]"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-muted/20 py-4">
                            <Badge variant="outline" className="bg-background">
                                <Sparkles className="mr-1 h-3 w-3 text-indigo-400" />
                                AI Optimized (Coming Soon)
                            </Badge>
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity text-white" disabled={loading}>
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
