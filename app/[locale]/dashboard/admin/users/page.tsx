import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/isAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface UserRow {
  id: string
  email: string
  name: string | null
  plan: string
  role: string
  created_at: string
  projectCount: number
}

type SortField = 'projects' | 'joined'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; dir?: string; page?: string }>
}) {
  const admin = await isAdmin()
  const locale = await getLocale()

  if (!admin) {
    redirect(`/${locale}/dashboard/projects`)
  }

  const { sort, dir, page } = await searchParams
  const sortField: SortField = sort === 'joined' ? 'joined' : 'projects'
  const sortDir: SortDir = dir === 'asc' ? 'asc' : 'desc'
  const currentPage = Math.max(1, parseInt(page ?? '1', 10))

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

  const allRows: UserRow[] = (users ?? [])
    .map(u => ({ ...u, projectCount: countMap[u.id] ?? 0 }))
    .sort((a, b) => {
      if (sortField === 'projects') {
        return sortDir === 'desc'
          ? b.projectCount - a.projectCount
          : a.projectCount - b.projectCount
      }
      return sortDir === 'desc'
        ? b.created_at.localeCompare(a.created_at)
        : a.created_at.localeCompare(b.created_at)
    })

  const totalPages = Math.ceil(allRows.length / PAGE_SIZE)
  const rows = allRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const buildHref = (p: number) =>
    `/dashboard/admin/users?sort=${sortField}&dir=${sortDir}&page=${p}`

  const nextDir = (field: SortField): SortDir =>
    sortField === field && sortDir === 'desc' ? 'asc' : 'desc'

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="inline size-3.5 ml-1 text-gray-400" />
    return sortDir === 'desc'
      ? <ChevronDown className="inline size-3.5 ml-1" />
      : <ChevronUp className="inline size-3.5 ml-1" />
  }

  return (
    <div className="p-4 sm:p-6 pt-20 sm:pt-25">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t('users')}</h1>
          <p className="text-muted-foreground mt-1">{t('totalUsers', { count: allRows.length })}</p>
        </div>

        {/* Mobile: cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          {rows.map(user => (
            <Link
              key={user.id}
              href={`/dashboard/admin/users/${user.id}`}
              className="border rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{user.email}</p>
                  {user.name && <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-gray-400">
                <span>{t('projectCount', { count: user.projectCount })}</span>
                <span>·</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  <Link
                    href={`/dashboard/admin/users?sort=projects&dir=${nextDir('projects')}&page=1`}
                    className="inline-flex items-center gap-0.5 hover:text-black transition-colors cursor-pointer select-none"
                  >
                    Projects<SortIcon field="projects" />
                  </Link>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  <Link
                    href={`/dashboard/admin/users?sort=joined&dir=${nextDir('joined')}&page=1`}
                    className="inline-flex items-center gap-0.5 hover:text-black transition-colors cursor-pointer select-none"
                  >
                    Joined<SortIcon field="joined" />
                  </Link>
                </th>
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
                  <td className="px-4 py-3 text-gray-600">{t('projectCount', { count: user.projectCount })}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, allRows.length)} of {allRows.length}
            </p>
            <div className="flex items-center gap-1">
              {currentPage > 1 ? (
                <Link
                  href={buildHref(currentPage - 1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                </Link>
              ) : (
                <span className="p-2 text-gray-300">
                  <ChevronLeft className="size-4" />
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={buildHref(p as number)}
                      className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                        currentPage === p
                          ? 'bg-black text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}

              {currentPage < totalPages ? (
                <Link
                  href={buildHref(currentPage + 1)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="p-2 text-gray-300">
                  <ChevronRight className="size-4" />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
