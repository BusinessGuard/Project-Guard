'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export function ScoreCard() {
  const t = useTranslations('dashboard.scoreCard');
  const tAnalysis = useTranslations('analysis');
  const { currentProject, audienceType } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const analysis = currentProject.analysis;
  
  const { overall: overallScore, readiness: readinessStatus } = analysis.scores;
  const { percentile: benchmarkPercentile, betterThan: benchmarkBetterThan } = analysis.benchmark;

  const getScoreBadge = useMemo(() => {
    return (score: number): { label: string; color: string } => {
      if (score >= 90) return { label: t('scoreBadges.exceptional'), color: 'bg-green-600' };
      if (score >= 80) return { label: t('scoreBadges.excellent'), color: 'bg-green-500' };
      if (score >= 70) return { label: t('scoreBadges.good'), color: 'bg-yellow-500' };
      if (score >= 60) return { label: t('scoreBadges.fair'), color: 'bg-yellow-600' };
      if (score >= 50) return { label: t('scoreBadges.weak'), color: 'bg-orange-600' };
      return { label: t('scoreBadges.critical'), color: 'bg-red-600' };
    };
  }, [t]);

  const scoreBadge = getScoreBadge(overallScore);

  const getProfileLabel = useMemo(() => {
    const emojis = {
      venture: '🚀',
      bank: '🏦',
      corporate: '🏢'
    };
    const emoji = emojis[audienceType] || '';
    const label = t(`profileLabels.${audienceType}`);
    return emoji ? `${emoji} ${label}` : label;
  }, [audienceType, t]);

  const getProfileFocus = useMemo(() => {
    return t(`profileFocus.${audienceType}`);
  }, [audienceType, t]);

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-xl">
      <CardContent className="pt-4 pb-4 md:pt-8 md:pb-8 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
          <div className="text-center">
            <div className="text-xs md:text-sm font-medium opacity-90 mb-1 md:mb-2 uppercase tracking-wide">
              {tAnalysis('overallScore')}
            </div>
            <div className="text-5xl md:text-7xl font-bold mb-1 md:mb-2">{overallScore}</div>
            <div className="text-xs md:text-sm opacity-90">{t('outOf100')}</div>
          </div>

          <div className="text-center">
            <div className={`inline-flex px-3 py-1.5 md:px-6 md:py-3 ${scoreBadge.color} rounded-full text-white font-bold text-sm md:text-lg mb-2 md:mb-3 shadow-lg`}>
              {scoreBadge.label}
            </div>
            <div className="text-base md:text-lg font-semibold">{readinessStatus}</div>
          </div>

          <div className="text-center">
            <div className="hidden md:block text-xs md:text-sm opacity-90 mb-1 md:mb-2">{t('benchmark')}</div>
            <div className="text-2xl md:text-4xl font-bold mb-0.5 md:mb-1">{t('topPercent', { percent: benchmarkPercentile })}</div>
            <div className="text-xs md:text-sm opacity-90">{t('betterThan', { percent: benchmarkBetterThan })}</div>
          </div>

          <div className="text-center">
            <div className="hidden md:block  text-xs md:text-sm opacity-90 mb-1 md:mb-2">{t('profile')}</div>
            <div className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">{getProfileLabel}</div>
            <div className="text-xs md:text-sm opacity-90 line-clamp-2">{getProfileFocus}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
