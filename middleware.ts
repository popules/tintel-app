import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const host = request.headers.get('host') || ''

    // Redirect 'app.' subdomain root to dashboard
    const isApp = host.startsWith('app.') || host.includes('.app.')

    if (isApp && url.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protected routes
    const isProtectedRoute =
        url.pathname.startsWith('/company/dashboard') ||
        url.pathname.startsWith('/candidate/dashboard') ||
        url.pathname.startsWith('/admin');

    const response = await updateSession(request)

    // After session update, check if we have a user
    const supabase = createClient(request, response)
    const { data: { user } } = await supabase.auth.getUser()

    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', url.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return response
}

/* 
  Helper to create client for middleware context 
  (Usually this logic exists inside updateSession, but we need the user here)
*/
import { createServerClient, type CookieOptions } from '@supabase/ssr'
function createClient(request: NextRequest, response: NextResponse) {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({ request: { headers: request.headers } })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
