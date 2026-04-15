'use client';

import { useVersionsStore } from '@/store/useVersionsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function GrowthPlan() {
  const t = useTranslations('dashboard.growthPlan');
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const phases = currentProject.analysis.growthPlan.phases;
  
  return (
    <div className="space-y-2 md:space-y-0">
      {Object.entries(phases).filter(([key]) => key.startsWith('phase')).map(([phaseKey, phase], index) => (
        <Card key={phaseKey} className={cn("shadow-none rounded-none", index !== 0 && "border-t-0", index === 0 && 'rounded-t-lg', index === Number(Object.keys(phases).length - 1) && 'rounded-b-lg')}>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm md:text-lg">{phase.name}</CardTitle>
                <p className="text-xs md:text-sm text-gray-600 mt-1">{phase.duration}</p>
              </div>
              <div className="text-left md:text-right">
                <div className="text-xs md:text-sm text-gray-600">{t('budget')}</div>
                <div className="text-lg md:text-2xl font-bold text-green-500">{phase.budget}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 pt-3 md:pt-6 p-3 md:p-6">
            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2">{t('goals')}:</h4>
              <ul className="space-y-1">
                {phase.goals.map((goal, idx) => (
                  <li key={idx} className="text-xs md:text-sm pl-3 md:pl-4">
                    {idx + 1}. {goal}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs md:text-sm mb-2">{t('keyActions')}:</h4>
              <ul className="space-y-1">
                {phase.keyActions.map((action, idx) => (
                  <li key={idx} className="text-xs md:text-sm pl-3 md:pl-4">
                    • {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-6 pt-2 text-xs md:text-sm">
              <div>
                <span className="font-medium">{t('teamSize')}:</span>
                <span className="text-gray-600 ml-1 md:ml-2">{phase.teamSize}</span>
              </div>
              <div>
                <span className="font-medium">{t('successMetrics')}:</span>
                <span className="text-gray-600 ml-1 md:ml-2">
                  {phase.successMetrics.join(', ')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
