```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';

    // Debugging (visible in Vercel logs)
    // console.log(`Middleware: Hostname = ${ host }, Path = ${ url.pathname } `) // Removed as per instruction

    // Redirect 'app.' subdomain root to dashboard
    // We check both host and x-forwarded-host for Vercel edge consistency
    const isApp = host.startsWith('app.');

    if (isApp && url.pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url), { status: 307 });
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
