import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',  // Key setting! Default locale (en) works WITHOUT prefix
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for auth routes - let them handle themselves
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Step 1: Handle i18n routing
  const response = intlMiddleware(request);

  // Step 2: Create supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Step 3: Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Step 4: Protect routes (except /create and public routes)
  const isProtectedRoute = 
    (pathname.includes('/dashboard') || pathname.includes('/project')) && 
    !pathname.includes('/create')
  
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response;
}

export const config = {
  // Exclude from localization: api, static files, _next, auth
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|auth).*)']
}
