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

export function RadarChartView() {
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const blockScores = currentProject.analysis.scores.blocks;

  // Transform blockScores to radar chart format
  const radarData = [
    { block: 'Value Prop', score: blockScores.valueProposition, fullMark: 100 },
    { block: 'Customers', score: blockScores.customerSegments, fullMark: 100 },
    { block: 'Channels', score: blockScores.channels, fullMark: 100 },
    { block: 'Revenue', score: blockScores.revenue, fullMark: 100 },
    { block: 'Costs', score: blockScores.costs, fullMark: 100 },
    { block: 'Resources', score: blockScores.keyResources, fullMark: 100 },
    { block: 'Activities', score: blockScores.keyActivities, fullMark: 100 },
    { block: 'Partners', score: blockScores.keyPartners, fullMark: 100 },
    { block: 'Team', score: blockScores.team, fullMark: 100 },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        9-Block Business Model Analysis
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="block" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280' }} />
          <Radar
            name="Score"
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
