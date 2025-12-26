"use client";

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n-context'

function SignupForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const { t, locale, setLocale } = useTranslation()

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'sv' : 'en');
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        full_name: fullName,
                        role: 'recruiter',
                        preferred_language: locale, // Important: Save preference on signup
                    },
                },
            })

            if (signupError) throw signupError;

            if (data.session) {
                const plan = searchParams.get('plan')
                const priceId = searchParams.get('priceId')

                // Send Welcome Email (Fire and forget)
                // We use the fullName passed to the form, or fallback to 'there'
                import('@/app/actions/email').then(mod => {
                    mod.sendWelcomeEmail(email, fullName);
                });

                if (plan && priceId) {
                    window.location.href = `/api/checkout?priceId=${priceId}&planType=subscription`;
                } else {
                    router.push('/company/dashboard?welcome=true')
                    router.refresh()
                }
            } else {
                setSubmitted(true)
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4 relative">
                <div className="absolute top-4 right-4 z-50">
                    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="uppercase font-bold text-muted-foreground hover:text-foreground">
                        <Globe className="mr-2 h-4 w-4" />
                        {locale}
                    </Button>
                </div>

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
        <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4 relative">
            <div className="absolute top-4 right-4 z-50">
                <Button variant="ghost" size="sm" onClick={toggleLanguage} className="uppercase font-bold text-muted-foreground hover:text-foreground">
                    <Globe className="mr-2 h-4 w-4" />
                    {locale}
                </Button>
            </div>

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
                        <CardTitle className="text-2xl font-bold tracking-tight">{t.auth.signup_title}</CardTitle>
                        <CardDescription>
                            {t.auth.signup_subtitle}
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
                                <Label htmlFor="fullname">{t.auth.full_name_label}</Label>
                                <Input
                                    id="fullname"
                                    placeholder={t.auth.full_name_placeholder}
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-muted/50 rounded-xl h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t.auth.email_label}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t.auth.email_placeholder}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-muted/50 rounded-xl h-11"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">{t.auth.password_label}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-muted/50 rounded-xl h-11"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 h-12 rounded-xl font-bold" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.auth.create_account}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                {t.auth.already_account}{' '}
                                <Link
                                    href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                                    className="underline underline-offset-4 hover:text-indigo-600 text-foreground transition-colors"
                                >
                                    {t.auth.sign_in}
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <SignupForm />
        </Suspense>
    )
}
