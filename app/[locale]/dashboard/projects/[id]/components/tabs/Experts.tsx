'use client';

import { useState } from 'react';
import { useVersionsStore } from '@/store/useVersionsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Shield, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Experts() {
  const t = useTranslations('dashboard.experts');
  const tAnalysis = useTranslations('analysis');
  const { currentProject } = useVersionsStore();
  const [expandedExperts, setExpandedExperts] = useState<Record<string, boolean>>({});
  
  if (!currentProject?.analysis) return null;
  
  const analysis = currentProject.analysis;
  
  const toggleExpert = (expertKey: string): void => {
    setExpandedExperts(prev => ({
      ...prev,
      [expertKey]: !prev[expertKey]
    }));
  };
  
  const expertsList = analysis.experts.list;
  
  // Display all experts directly without filtering by field
  // Each expert is identified by their field value (unique within analysis)
  return (
    <div className="space-y-4">
      {expertsList.map((expert, index) => {
        const expertKey = `${expert.field}-${index}`; // Unique key for each expert
        return (
        <Card key={expertKey} className="shadow-none">
          <CardHeader className="block">
            <div 
              className="flex flex-col md:flex-row items-start md:justify-between gap-3 cursor-pointer"
              onClick={() => toggleExpert(expertKey)}
            >
              <div className="flex items-start gap-3 w-full">
                <span className="text-3xl md:text-4xl flex-shrink-0">{expert.avatar}</span>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg">{expert.name}</CardTitle>
                  <p className="text-xs md:text-sm text-gray-600">{expert.role}</p>
                  <p className="hidden md:block :text-sm text-gray-700 mt-2">{expert.summary}</p>
                </div>
              </div>
              <p className="block md:hidden text-xs text-center md:text-sm text-gray-700 mb-auto">{expert.summary}</p>

              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end flex-shrink-0">
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {t('confidence')}: {expert.confidence}%
                </Badge>
                {expandedExperts[expertKey] ? <ChevronUp className="w-4 h-4 md:w-5 md:h-5" /> : <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />}
              </div>
            </div>
          </CardHeader>
          
          {expandedExperts[expertKey] && (
            <CardContent className="space-y-4 pt-0 px-3 md:px-6">
              {expert.keyFindings && (
                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                    {t('keyFindings')}
                  </h4>
                  <ul className="space-y-1">
                    {expert.keyFindings.map((finding, idx) => (
                      <li key={idx} className="text-xs md:text-sm text-gray-700 pl-4 md:pl-6">
                        • {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {expert.criticalRisks && expert.criticalRisks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-red-600 flex-shrink-0" />
                    {t('criticalRisks')}
                  </h4>
                  <div className="space-y-2">
                    {expert.criticalRisks.map((risk, idx) => (
                      <div key={idx} className="border border-red-200 rounded-lg p-2 md:p-3 bg-red-50">
                        <div className="flex items-start gap-1.5 md:gap-2 mb-2 flex-wrap">
                          <Badge className="bg-red-600 text-white text-[10px] md:text-xs">
                            {risk.category}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] md:text-xs">
                            {risk.likelihood} {t('likelihood')}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] md:text-xs">
                            {risk.impact} {t('impact')}
                          </Badge>
                        </div>
                        <p className="text-xs md:text-sm font-medium mb-1">{risk.description}</p>
                        <p className="text-[10px] md:text-xs text-gray-600">
                          <strong>{t('mitigation')}:</strong> {risk.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expert.concerns && (
                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-orange-600 flex-shrink-0" />
                    {t('concerns')}
                  </h4>
                  <ul className="space-y-1">
                    {expert.concerns.map((concern, idx) => (
                      <li key={idx} className="text-xs md:text-sm text-gray-700 pl-4 md:pl-6">
                        • {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {expert.recommendations && (
                <div>
                  <h4 className="font-semibold text-xs md:text-sm mb-2 flex items-center gap-2">
                    <Target className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                    {tAnalysis('recommendations')}
                  </h4>
                  <ul className="space-y-1">
                    {expert.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs md:text-sm text-gray-700 pl-4 md:pl-6">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          )}
        </Card>
        );
      })}
    </div>
  );
}
