"use client";

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner' // Assuming sonner is installed, otherwise I'll fallback to basic error state

export default function CandidateSignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'candidate', // Critical: Sets the role for the trigger
                    },
                    emailRedirectTo: `${location.origin}/auth/callback?next=/candidate/onboarding`,
                },
            })

            if (error) throw error;

            // Ideally check if session exists (auto-confirm) or if user needs to check email
            if (data.user && !data.session) {
                setSuccess(true)
            } else {
                router.push('/candidate/onboarding')
            }

        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="max-w-md border-green-500/20 bg-green-500/5 backdrop-blur">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription>
                            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
                            Click it to start building your profile.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Link href="/candidate/login">
                            <Button variant="ghost">Return to Login</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Hitta Drömjobbet
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Bli upptäckt av rekryterare. Inget spam, bara jobb.
                    </p>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <form onSubmit={handleSignup}>
                        <CardContent className="grid gap-4 pt-6">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="fullName">För- och efternamn</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Sven Svensson"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">E-post</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="namn@exempel.se"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Lösenord</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-opacity text-white" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Skapa Konto
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Har du redan ett konto?{' '}
                                <Link href="/candidate/login" className="underline underline-offset-4 hover:text-indigo-400 transition-colors">
                                    Logga in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
