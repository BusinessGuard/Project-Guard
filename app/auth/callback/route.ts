import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the origin from the request
      const origin = requestUrl.origin
      
      console.log('✅ OAuth success, redirecting to:', `${origin}/en/dashboard/projects`)
      
      // Redirect to dashboard/projects
      return NextResponse.redirect(`${origin}/en/dashboard/projects`)
    } else {
      console.error('❌ OAuth error:', error)
    }
  }

  // Fallback redirect
  console.log('⚠️ No code found, redirecting to home')
  return NextResponse.redirect(`${requestUrl.origin}/en`)
}
