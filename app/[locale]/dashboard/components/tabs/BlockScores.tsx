'use client';

import { Progress } from '@/components/ui/progress';
import { useAnalizeStore } from '@/store/useAnalizeStore';

export function BlockScores() {
  const analysis = useAnalizeStore((state) => state.analysis);
  
  if (!analysis) return null;
  
  const blockScores = analysis.scores.blocks; 

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Detailed Block Scores</h3>
      <div className="space-y-3">
        {Object.entries(blockScores).map(([block, score]) => (
          <div key={block} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium capitalize">
                {block.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
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
