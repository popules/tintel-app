"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, CheckCircle2, AlertCircle, Phone, MapPin, Globe, Linkedin, User, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SWEDISH_COUNTIES } from "@/lib/data/counties";

export default function CandidateOnboarding() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [magicLoading, setMagicLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [website, setWebsite] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/candidate/login");
                    return;
                }
                setUser(user);

                // Fetch existing candidate data
                const { data: candidate, error: fetchError } = await supabase
                    .from("candidates")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                // Fetch existing profile data (for avatar)
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("avatar_url")
                    .eq("id", user.id)
                    .single();

                if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);

                if (candidate) {
                    setHeadline(candidate.headline || "");
                    setBio(candidate.bio || "");
                    setSkills(candidate.skills ? candidate.skills.join(", ") : "");
                    setExperience(candidate.years_of_experience?.toString() || "");
                    setLocation(candidate.location || "");
                    setPhone(candidate.phone || "");
                    setAddress(candidate.address || "");
                    setLinkedin(candidate.linkedin_url || "");
                    setWebsite(candidate.website || "");
                }
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchUser();
    }, [router, supabase]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/${Math.random()}.${fileExt}`;

            // Smart Compression Config
            const options = {
                maxSizeMB: 1, // Safe limit (Storage is 500MB, so 1MB is fine)
                maxWidthOrHeight: 800, // 800px is plenty for a profile circle
                useWebWorker: true,
                fileType: "image/jpeg"
            };

            // Dynamic import to avoid SSR issues
            const imageCompression = (await import("browser-image-compression")).default;
            const compressedFile = await imageCompression(file, options);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, compressedFile);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
            toast.success("Image uploaded successfully!");
        } catch (error: any) {
            console.error(error);
            toast.error("Error uploading avatar: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleMagicFill = async () => {
        if (!headline) {
            toast.error("Please enter a headline first (e.g. 'Senior Frontend Developer')");
            return;
        }
        setMagicLoading(true);
        // Simulation of AI generation for immediate feedback
        setTimeout(() => {
            setBio(`Passionate ${headline} with a proven track record of delivering high-quality solutions. Expert in modern technologies and dedicated to continuous improvement. focused on creating efficient, scalable, and user-friendly applications.`);
            setSkills("React, TypeScript, Next.js, Node.js, UI/UX Design, Agile Methodologies, Git, Cloud Infrastructure");
            setMagicLoading(false);
            toast.success("Profile magically enhanced!");
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!user) throw new Error("No user found");

            // 1. Update Candidate Table
            const { error: candidateError } = await supabase
                .from("candidates")
                .upsert({
                    id: user.id,
                    headline,
                    bio,
                    skills: skills.split(",").map(s => s.trim()).filter(Boolean),
                    years_of_experience: parseInt(experience) || 0,
                    location,
                    phone,
                    address,
                    linkedin_url: linkedin,
                    website,
                    updated_at: new Date().toISOString(),
                });

            if (candidateError) throw candidateError;

            // 2. Update Profile Table (Avatar)
            if (avatarUrl) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .update({ avatar_url: avatarUrl })
                    .eq("id", user.id);

                if (profileError) console.warn("Failed to update avatar:", profileError);
            }

            setSuccess(true);
            toast.success("Profile saved successfully!");
        } catch (err: any) {
            console.error("Error saving profile:", err);
            setError(err.message || "Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black/95">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 max-w-md"
                >
                    <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center ring-1 ring-green-500/50">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">You're all set!</h1>
                    <p className="text-muted-foreground">Your profile has been created and is now visible to top recruiters.</p>
                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            size="lg"
                            className="w-full bg-white text-black hover:bg-gray-200"
                            onClick={() => router.push('/candidate/dashboard')}
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full border-white/10 text-white hover:bg-white/5"
                            onClick={() => router.push('/candidate/cv')}
                        >
                            Download CV
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 flex justify-center py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                        Build your Profile
                    </h1>
                    <p className="text-muted-foreground text-lg">Let's make you stand out.</p>
                </div>

                <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Professional Details</span>
                            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-0">
                                <Wand2 className="w-3 h-3 mr-1" /> AI Optimized
                            </Badge>
                        </CardTitle>
                        <CardDescription>Tell us about your expertise and we'll help write the rest.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-red-200">
                                    <p className="font-bold">Save Failed</p>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Personal Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contact Info</h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                placeholder="+46 70 123 45 67"
                                                className="pl-9 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Select value={location} onValueChange={setLocation}>
                                            <SelectTrigger className="bg-black/20 border-white/5 focus:border-indigo-500/50">
                                                <SelectValue placeholder="Select Region" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SWEDISH_COUNTIES.map((county) => (
                                                    <SelectItem key={county} value={county}>{county}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address (Optional)</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="address"
                                            placeholder="Street Address, City, Zip"
                                            className="pl-9 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Portfolio / Personal Website (Optional)</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="website"
                                                placeholder="https://your-portfolio.com"
                                                className="pl-9 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="linkedin"
                                                placeholder="https://linkedin.com/in/you"
                                                className="pl-9 bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="avatar">Profile Picture (Optional)</Label>
                                    <div className="flex items-center gap-4">
                                        {avatarUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
                                                <User className="h-8 w-8" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full border-white/5 bg-black/20 hover:bg-white/5">
                                                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                                {uploading ? "Uploading..." : "Upload Photo"}
                                            </label>
                                            <Input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-2">Only images allowed. Max 2MB.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Professional Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Experience & Skills</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Professional Headline</Label>
                                        <Input
                                            id="headline"
                                            placeholder="e.g. Senior Frontend Developer"
                                            className="bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                            value={headline}
                                            onChange={(e) => setHeadline(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            min="0"
                                            placeholder="e.g. 5"
                                            className="bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="bio">Professional Summary</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                            onClick={handleMagicFill}
                                            disabled={magicLoading}
                                        >
                                            {magicLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                                            {magicLoading ? "Generating..." : "Magic Fill with AI"}
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="bio"
                                        placeholder="Briefly describe your background and expertise..."
                                        className="min-h-[120px] bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors resize-none"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="skills">Skills & Certificates</Label>
                                    <Textarea
                                        id="skills"
                                        placeholder="Comma separated: React, Node.js, AWS Certified..."
                                        className="bg-black/20 border-white/5 focus:border-indigo-500/50 transition-colors"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                    />
                                </div>
                            </div>

                            <CardFooter className="px-0 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11 rounded-lg transition-all"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Creating Profile..." : "Create Profile"}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
