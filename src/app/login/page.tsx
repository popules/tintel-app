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

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
        } else if (user) {
            // Check Profile Role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const role = profile?.role;

            if (role === 'candidate') {
                router.push('/candidate/dashboard');
            } else {
                // Default to company dashboard for recruiters / admins
                router.push('/company/dashboard');
            }
            router.refresh()
        }
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
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <div className="h-4 w-4 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20 ring-2 ring-white/10" />
                            <span className="font-black text-3xl tracking-tighter">tintel</span>
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                        <CardDescription>
                            Sign in to your Tintel account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-4">
                            {error && (
                                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-medium text-center">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-muted/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-muted/50"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="underline underline-offset-4 hover:text-indigo-600 text-foreground transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}
