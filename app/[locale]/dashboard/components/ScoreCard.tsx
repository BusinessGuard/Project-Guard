'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useVersionsStore } from '@/store/useVersionsStore';

export function ScoreCard() {
  const { currentProject, audienceType } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const analysis = currentProject.analysis;
  
  const { overall: overallScore, readiness: readinessStatus } = analysis.scores;
  const { percentile: benchmarkPercentile, betterThan: benchmarkBetterThan } = analysis.benchmark;

  const getScoreBadge = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'EXCEPTIONAL', color: 'bg-green-600' };
    if (score >= 80) return { label: 'EXCELLENT', color: 'bg-green-500' };
    if (score >= 70) return { label: 'GOOD', color: 'bg-yellow-500' };
    if (score >= 60) return { label: 'FAIR', color: 'bg-yellow-600' };
    if (score >= 50) return { label: 'WEAK', color: 'bg-orange-600' };
    return { label: 'CRITICAL', color: 'bg-red-600' };
  };

  const scoreBadge = getScoreBadge(overallScore);

  const getProfileLabel = () => {
    switch (audienceType) {
      case 'venture': return '🚀 VC Focus';
      case 'bank': return '🏦 Bank Focus';
      case 'corporate': return '🏢 Corp Focus';
      default: return '';
    }
  };

  const getProfileFocus = () => {
    switch (audienceType) {
      case 'venture': return 'team, valueProposition, customerSegments';
      case 'bank': return 'revenue, costs, keyResources';
      case 'corporate': return 'keyActivities, keyPartners, valueProposition';
      default: return '';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
      <CardContent className="pt-4 pb-4 md:pt-8 md:pb-8 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
          <div className="text-center">
            <div className="text-xs md:text-sm font-medium opacity-90 mb-1 md:mb-2 uppercase tracking-wide">
              Overall Score
            </div>
            <div className="text-5xl md:text-7xl font-bold mb-1 md:mb-2">{overallScore}</div>
            <div className="text-xs md:text-sm opacity-90">out of 100</div>
          </div>

          <div className="text-center">
            <div className={`inline-flex px-3 py-1.5 md:px-6 md:py-3 ${scoreBadge.color} rounded-full text-white font-bold text-sm md:text-lg mb-2 md:mb-3 shadow-lg`}>
              {scoreBadge.label}
            </div>
            <div className="text-base md:text-lg font-semibold">{readinessStatus}</div>
          </div>

          <div className="text-center">
            <div className="hidden md:block text-xs md:text-sm opacity-90 mb-1 md:mb-2">BENCHMARK</div>
            <div className="text-2xl md:text-4xl font-bold mb-0.5 md:mb-1">Top {benchmarkPercentile}%</div>
            <div className="text-xs md:text-sm opacity-90">Better than {benchmarkBetterThan}%</div>
          </div>

          <div className="text-center">
            <div className="hidden md:block  text-xs md:text-sm opacity-90 mb-1 md:mb-2">PROFILE</div>
            <div className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">{getProfileLabel()}</div>
            <div className="text-xs md:text-sm opacity-90 line-clamp-2">{getProfileFocus()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
