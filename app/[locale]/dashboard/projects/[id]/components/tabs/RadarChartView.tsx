'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export function RadarChartView() {
  const t = useTranslations('dashboard.radarChartView');
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const blockScores = currentProject.analysis.scores.blocks;

  // Transform blockScores to radar chart format
  const radarData = useMemo(() => [
    { block: t('blocks.valueProp'), score: blockScores.valueProposition, fullMark: 100 },
    { block: t('blocks.customers'), score: blockScores.customerSegments, fullMark: 100 },
    { block: t('blocks.channels'), score: blockScores.channels, fullMark: 100 },
    { block: t('blocks.revenue'), score: blockScores.revenue, fullMark: 100 },
    { block: t('blocks.costs'), score: blockScores.costs, fullMark: 100 },
    { block: t('blocks.resources'), score: blockScores.keyResources, fullMark: 100 },
    { block: t('blocks.activities'), score: blockScores.keyActivities, fullMark: 100 },
    { block: t('blocks.partners'), score: blockScores.keyPartners, fullMark: 100 },
    { block: t('blocks.team'), score: blockScores.team, fullMark: 100 },
  ], [blockScores, t]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {t('title')}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="block" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
          <Radar
            name={t('score')}
            dataKey="score"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
