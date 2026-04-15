'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/navigation'
import type { PlatformStats } from './page'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="border rounded-xl p-4 sm:p-5 bg-white">
      <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

export function StatsClient({ stats }: { stats: PlatformStats }) {
  const t = useTranslations('stats')

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Top stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label={t('totalUsers')} value={stats.totalUsers} />
        <StatCard
          label={t('activeUsers')}
          value={stats.activeUsers30d}
          sub={t('last30days')}
        />
        <StatCard label={t('totalProjects')} value={stats.totalProjects} />
        <StatCard
          label={t('avgScore')}
          value={`${stats.avgScore}`}
          sub={t('outOf100')}
        />
      </div>

      {/* Projects over time */}
      <div className="border rounded-xl p-4 sm:p-5 bg-white">
        <h2 className="font-semibold mb-4">{t('projectsOverTime')}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={stats.projectsOverTime}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={d => d.slice(5)}
              interval={6}
            />
            <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} width={24} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              labelFormatter={l => String(l)}
            />
            <Area
              type="monotone"
              dataKey="projects"
              stroke="#000"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Industry + Stage charts */}
      <div className="grid lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="border rounded-xl p-4 sm:p-5 bg-white">
          <h2 className="font-semibold mb-4">{t('byIndustry')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byIndustry} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} width={24} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="projects" fill="#FFE000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border rounded-xl p-4 sm:p-5 bg-white">
          <h2 className="font-semibold mb-4">{t('byStage')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byStage} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} width={24} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="projects" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top projects — temporarily hidden */}
      {false && <div className="border rounded-xl bg-white overflow-hidden">
        <div className="p-4 sm:p-5 border-b">
          <h2 className="font-semibold">{t('topProjects')}</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500">#</th>
              <th className="text-left px-4 sm:px-5 py-3 font-medium text-gray-500">{t('projectName')}</th>
              <th className="hidden sm:table-cell text-left px-5 py-3 font-medium text-gray-500">{t('industry')}</th>
              <th className="text-right px-4 sm:px-5 py-3 font-medium text-gray-500">{t('score')}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {stats.topProjects.map((project, i) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 sm:px-5 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 sm:px-5 py-3">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{project.industry ?? '—'}</td>
                <td className="px-4 sm:px-5 py-3 text-right">
                  <span className={`font-bold ${
                    project.score >= 75 ? 'text-green-600' :
                    project.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {project.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  )
}
