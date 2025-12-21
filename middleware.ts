import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = url.hostname

    // Debugging (visible in Vercel logs)
    console.log(`Middleware: Hostname=${hostname}, Path=${url.pathname}`)

    // Redirect 'app.' subdomain root to dashboard
    const isAppSubdomain = hostname.startsWith('app.') || hostname.includes('.app.')

    if (isAppSubdomain && url.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return await updateSession(request)
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
