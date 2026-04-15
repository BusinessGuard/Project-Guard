import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/isAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/lib/navigation'

export default async function AdminUserProjectsPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const admin = await isAdmin()
  const locale = await getLocale()

  if (!admin) {
    redirect(`/${locale}/dashboard/projects`)
  }

  const t = await getTranslations('admin')
  const supabase = createAdminClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, email, name, created_at')
    .eq('id', userId)
    .single()

  if (!user) {
    redirect(`/${locale}/dashboard/admin/users`)
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, industry, stage, current_version, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 pt-25">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <Link
            href="/dashboard/admin/users"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← {t('users')}
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{user.name ?? user.email}</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
          <p className="text-sm text-gray-400 mt-0.5">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-3">
          {t('userProjects', { name: user.name ?? user.email })}
        </h2>

        {(projects ?? []).length === 0 ? (
          <p className="text-muted-foreground">{t('noProjects')}</p>
        ) : (
          <div className="grid gap-3">
            {(projects ?? []).map(project => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex gap-3 mt-1.5 text-sm text-gray-500">
                  {project.industry && <span>{project.industry}</span>}
                  {project.stage && <span>• {project.stage}</span>}
                  <span className="ml-auto">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
