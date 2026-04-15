import { createAdminClient } from '@/lib/supabase/admin'
import { getTranslations } from 'next-intl/server'
import { StatsClient } from './StatsClient'

export interface PlatformStats {
  totalUsers: number
  activeUsers30d: number
  totalProjects: number
  projects30d: number
  avgScore: number
  byIndustry: { name: string; projects: number }[]
  byStage: { name: string; projects: number }[]
  projectsOverTime: { date: string; projects: number }[]
  topProjects: { id: string; name: string; industry: string | null; score: number }[]
}

async function fetchStats(): Promise<PlatformStats> {
  const supabase = createAdminClient()
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: totalUsers },
    { data: projects },
    { data: versions },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('id, user_id, name, industry, stage, created_at'),
    supabase.from('project_versions').select('project_id, overall_score, created_at'),
  ])

  const allProjects = projects ?? []
  const allVersions = versions ?? []

  // Active users: distinct user_ids with projects in last 30 days
  const activeUserIds = new Set(
    allProjects
      .filter(p => p.user_id && p.created_at >= since30d)
      .map(p => p.user_id)
  )

  // Projects in last 30 days
  const projects30d = allProjects.filter(p => p.created_at >= since30d).length

  // Average score across all versions
  const scores = allVersions.map(v => v.overall_score).filter((s): s is number => s !== null)
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  // By industry
  const industryMap: Record<string, number> = {}
  for (const p of allProjects) {
    const key = p.industry || 'Other'
    industryMap[key] = (industryMap[key] ?? 0) + 1
  }
  const byIndustry = Object.entries(industryMap)
    .map(([name, count]) => ({ name, projects: count }))
    .sort((a, b) => b.projects - a.projects)
    .slice(0, 8)

  // By stage
  const stageMap: Record<string, number> = {}
  for (const p of allProjects) {
    const key = p.stage || 'Unknown'
    stageMap[key] = (stageMap[key] ?? 0) + 1
  }
  const byStage = Object.entries(stageMap)
    .map(([name, count]) => ({ name, projects: count }))
    .sort((a, b) => b.projects - a.projects)

  // Projects over last 30 days (by day)
  const dayMap: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    dayMap[d.toISOString().slice(0, 10)] = 0
  }
  for (const p of allProjects) {
    const day = p.created_at.slice(0, 10)
    if (day in dayMap) dayMap[day]++
  }
  const projectsOverTime = Object.entries(dayMap).map(([date, count]) => ({ date, projects: count }))

  // Top 10 projects by best version score
  const bestScoreMap: Record<string, number> = {}
  for (const v of allVersions) {
    if (v.overall_score !== null) {
      bestScoreMap[v.project_id] = Math.max(bestScoreMap[v.project_id] ?? 0, v.overall_score)
    }
  }
  const topProjects = allProjects
    .filter(p => bestScoreMap[p.id] !== undefined)
    .map(p => ({ id: p.id, name: p.name, industry: p.industry, score: bestScoreMap[p.id] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  return {
    totalUsers: totalUsers ?? 0,
    activeUsers30d: activeUserIds.size,
    totalProjects: allProjects.length,
    projects30d,
    avgScore,
    byIndustry,
    byStage,
    projectsOverTime,
    topProjects,
  }
}

export default async function StatsPage() {
  const t = await getTranslations('stats')
  const stats = await fetchStats()

  return (
    <div className="p-4 sm:p-6 pt-20 sm:pt-25">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <StatsClient stats={stats} />
      </div>
    </div>
  )
}
