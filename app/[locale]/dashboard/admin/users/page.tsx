import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/isAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'

interface UserRow {
  id: string
  email: string
  name: string | null
  plan: string
  role: string
  created_at: string
  projectCount: number
}

export default async function AdminUsersPage() {
  const admin = await isAdmin()
  const locale = await getLocale()

  if (!admin) {
    redirect(`/${locale}/dashboard/projects`)
  }

  const t = await getTranslations('admin')
  const supabase = createAdminClient()

  const { data: users } = await supabase
    .from('users')
    .select('id, email, name, plan, role, created_at')
    .order('created_at', { ascending: false })

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

  const rows: UserRow[] = (users ?? []).map(u => ({
    ...u,
    projectCount: countMap[u.id] ?? 0,
  }))

  return (
    <div className="p-6 pt-25">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('users')}</h1>
          <p className="text-muted-foreground mt-1">{t('totalUsers', { count: rows.length })}</p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">{t('projectCount', { count: 0 }).replace('0 ', '')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/admin/users/${user.id}`}
                      className="font-medium hover:underline"
                    >
                      {user.email}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t('projectCount', { count: user.projectCount })}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
