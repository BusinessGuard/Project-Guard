import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const origin = requestUrl.origin
      const next = requestUrl.searchParams.get('next')
      const redirectUrl = next ? `${origin}${next}` : `${origin}/en/dashboard/projects`
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('❌ OAuth error:', error)
    }
  }

  // Fallback redirect
  console.log('⚠️ No code found, redirecting to home')
  return NextResponse.redirect(`${requestUrl.origin}/en`)
}
