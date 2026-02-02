'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVersionsStore } from '@/store/useVersionsStore';
import { CheckCircle, AlertTriangle, Award, Flame } from 'lucide-react';

export function StrengthsWeaknesses() {
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const { topStrengths, topWeaknesses } = currentProject.analysis.consensus.findings;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-none ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Top Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topStrengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="w-5 h-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topWeaknesses.map((weakness, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Flame className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{weakness}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
