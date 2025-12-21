"use client";

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [requestSent, setRequestSent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 1. Check if email is in the allowed list (Invite Only)
        const { data: allowed, error: allowedError } = await supabase
            .from('allowed_emails')
            .select('email')
            .eq('email', email.toLowerCase())
            .single()

        if (allowedError || !allowed) {
            // NOT WHITELISTED -> Submit an Access Request instead
            const { error: requestError } = await supabase
                .from('access_requests')
                .upsert({
                    email: email.toLowerCase(),
                    full_name: fullName,
                    status: 'pending'
                }, { onConflict: 'email' })

            if (requestError) {
                setError("Our partner queue is currently full. Please try again later or contact hello@tintel.se.")
            } else {
                setRequestSent(true)
            }
            setLoading(false)
            return
        }

        // 2. Proceed with Signup (They are whitelisted!)
        const { data, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: {
                    full_name: fullName,
                },
            },
        })

        if (signupError) {
            setError(signupError.message)
            setLoading(false)
        } else if (data.session) {
            // Confirmation is OFF in Supabase - Logged in immediately
            router.push('/dashboard')
            router.refresh()
        } else {
            // Confirmation is ON in Supabase - Show verification UI
            setSubmitted(true)
            setLoading(false)
        }
    }

    if (requestSent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm"
                >
                    <Card className="border-0 shadow-lg shadow-indigo-500/10 backdrop-blur-sm bg-background/80 p-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <span className="text-4xl font-black italic">t</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Application Received</h2>
                            <p className="text-muted-foreground">
                                Thank you for your interest. We've added <span className="text-foreground font-medium">{email}</span> to our partner queue.
                            </p>
                        </div>
                        <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-sm text-indigo-400">
                            To maintain platform quality, we approve new partners manually. You will receive an invitation link once your access is ready.
                        </div>
                        <Button className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl" onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    </Card>
                </motion.div>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm"
                >
                    <Card className="border-0 shadow-lg shadow-indigo-500/10 backdrop-blur-sm bg-background/80 p-8 text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <span className="text-2xl font-black italic">t</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
                        <p className="text-muted-foreground">
                            We've sent a confirmation link to <span className="text-foreground font-medium">{email}</span>.
                            Please verify your email to activate your account.
                        </p>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push('/login')}>
                            Back to Login
                        </Button>
                    </Card>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-sm"
            >
                <Card className="border-0 shadow-lg shadow-indigo-500/10 backdrop-blur-sm bg-background/80">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                                <span className="text-white font-black text-3xl -mt-1 leading-none tracking-tighter">t</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Partner Access</CardTitle>
                        <CardDescription>
                            Membership is currently by invitation only
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignup}>
                        <CardContent className="grid gap-4">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl font-medium text-center border border-destructive/20">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="fullname font-semibold">Full Name</Label>
                                <Input
                                    id="fullname"
                                    placeholder="John Doe"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-muted/50 rounded-xl h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email font-semibold">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-muted/50 rounded-xl h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password font-semibold">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-muted/50 rounded-xl h-11"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 h-12 rounded-xl font-bold" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Apply for Access"}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Already have an account?{' '}
                                <Link href="/login" className="underline underline-offset-4 hover:text-indigo-600 text-foreground transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
