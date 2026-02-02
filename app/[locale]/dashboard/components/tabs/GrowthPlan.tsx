'use client';

import { useVersionsStore } from '@/store/useVersionsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function GrowthPlan() {
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const phases = currentProject.analysis.growthPlan.phases;
  
  return (
    <div >
      {Object.entries(phases).filter(([key]) => key.startsWith('phase')).map(([phaseKey, phase], index) => (
        <Card key={phaseKey} className={cn("shadow-none rounded-none", index !== 0 && "border-t-0", index === 0 && 'rounded-t-lg', index === Number(Object.keys(phases).length - 1) && 'rounded-b-lg')}>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{phase.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{phase.duration}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Budget</div>
                <div className="text-2xl font-bold text-green-500">{phase.budget}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h4 className="font-semibold text-sm mb-2">Goals:</h4>
              <ul className="space-y-1">
                {phase.goals.map((goal, idx) => (
                  <li key={idx} className="text-sm pl-4">
                    {idx + 1}. {goal}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Key Actions:</h4>
              <ul className="space-y-1">
                {phase.keyActions.map((action, idx) => (
                  <li key={idx} className="text-sm pl-4">
                    • {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-6 pt-2 text-sm flex-wrap">
              <div>
                <span className="font-medium">Team Size:</span>
                <span className="text-gray-600 ml-2">{phase.teamSize}</span>
              </div>
              <div>
                <span className="font-medium">Success Metrics:</span>
                <span className="text-gray-600 ml-2">
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
