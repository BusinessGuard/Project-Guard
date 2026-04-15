import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/utils/isAdmin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createAdminClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, name, plan, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // Get project counts for all users in one query
  const { data: projectCounts } = await supabase
    .from('projects')
    .select('user_id')
    .not('user_id', 'is', null)

  const countMap: Record<string, number> = {}
  for (const row of projectCounts ?? []) {
    if (row.user_id) {
      countMap[row.user_id] = (countMap[row.user_id] ?? 0) + 1
    }
  }

  const result = users.map(u => ({
    ...u,
    projectCount: countMap[u.id] ?? 0,
  }))

  return NextResponse.json({ success: true, data: result })
}
