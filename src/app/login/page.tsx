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

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const { t, locale, setLocale } = useTranslation()

    const toggleLanguage = () => {
        setLocale(locale === 'en' ? 'sv' : 'en');
    };

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
            // Update preferred_language on login if different
            await supabase.from('profiles').update({ preferred_language: locale }).eq('id', user.id);

            const plan = searchParams.get('plan')
            const priceId = searchParams.get('priceId')

            if (plan && priceId) {
                // Use window.location.href for API redirects to ensure external transition
                window.location.href = `/api/checkout?priceId=${priceId}&planType=subscription`;
            } else {
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
                        <CardTitle className="text-2xl font-bold tracking-tight">{t.auth.login_title}</CardTitle>
                        <CardDescription>
                            {t.auth.login_subtitle}
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
                                <Label htmlFor="email">{t.auth.email_label}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t.auth.email_placeholder}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-muted/50"
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
                                    className="bg-muted/50"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? t.auth.signing_in : t.auth.sign_in}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                {t.auth.no_account}{' '}
                                <Link
                                    href={`/signup${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                                    className="underline underline-offset-4 hover:text-indigo-600 text-foreground transition-colors"
                                >
                                    {t.auth.sign_up}
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
