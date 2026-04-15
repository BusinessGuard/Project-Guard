import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/** Only allow in-app paths with an explicit locale prefix (open-redirect safe). */
const SAFE_NEXT = /^\/(en|ru|uk)(\/[\w\-./]*)?$/

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextParam = requestUrl.searchParams.get('next')
  const origin = requestUrl.origin

  const safeNext =
    nextParam && SAFE_NEXT.test(nextParam) ? nextParam : null

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (safeNext) {
        return NextResponse.redirect(`${origin}${safeNext}`)
      }

      console.log('✅ OAuth success, redirecting to:', `${origin}/en/dashboard/projects`)
      return NextResponse.redirect(`${origin}/en/dashboard/projects`)
    }

    console.error('❌ OAuth error:', error)
  }

  console.log('⚠️ No code found, redirecting to home')
  return NextResponse.redirect(`${origin}/en`)
}
