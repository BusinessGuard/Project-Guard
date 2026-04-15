'use client';

import { Progress } from '@/components/ui/progress';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useTranslations } from 'next-intl';

export function BlockScores() {
  const t = useTranslations('dashboard.blockScores');
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const blockScores = currentProject.analysis.scores.blocks; 

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBlockLabel = (blockKey: string): string => {
    const blockKeyLower = blockKey.charAt(0).toLowerCase() + blockKey.slice(1);
    return t(`blocks.${blockKeyLower}`, { defaultValue: blockKey.replace(/([A-Z])/g, ' $1').trim() });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t('title')}</h3>
      <div className="md:space-y-3">
        {Object.entries(blockScores).map(([block, score]) => (
          <div key={block} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium capitalize">
                {getBlockLabel(block)}
              </span>
              <span className={`text-lg md:text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            <Progress value={score} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
