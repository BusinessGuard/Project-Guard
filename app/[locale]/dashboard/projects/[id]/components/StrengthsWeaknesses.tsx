'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVersionsStore } from '@/store/useVersionsStore';
import { CheckCircle, AlertTriangle, Award, Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function StrengthsWeaknesses() {
  const t = useTranslations('dashboard.strengthsWeaknesses');
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const { topStrengths, topWeaknesses } = currentProject.analysis.consensus.findings;
  return (
    <div className="grid md:grid-cols-2 gap-3 md:gap-6">
      <Card className="shadow-none">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-green-700 text-sm md:text-base">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
            {t('topStrengths')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {topStrengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm">{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="flex items-center gap-2 text-orange-700 text-sm md:text-base">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
            {t('areasForImprovement')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {topWeaknesses.map((weakness, idx) => (
              <div key={idx} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-orange-50 rounded-lg">
                <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs md:text-sm">{weakness}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
