import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/utils/isAdmin'
import { getLocale } from 'next-intl/server'

export default async function AdminPage() {
  const admin = await isAdmin()
  const locale = await getLocale()

  if (!admin) {
    redirect(`/${locale}/dashboard/projects`)
  }

  redirect(`/${locale}/dashboard/admin/users`)
}
