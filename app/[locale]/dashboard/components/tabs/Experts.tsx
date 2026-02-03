'use client';

import { useState } from 'react';
import { useVersionsStore } from '@/store/useVersionsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Shield, Target, ChevronDown, ChevronUp } from 'lucide-react';

export function Experts() {
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
          <CardHeader>
            <div 
              className="flex items-start justify-between cursor-pointer"
              onClick={() => toggleExpert(expertKey)}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{expert.avatar}</span>
                <div>
                  <CardTitle>{expert.name}</CardTitle>
                  <p className="text-sm text-gray-600">{expert.role}</p>
                  <p className="text-sm text-gray-700 mt-2">{expert.summary}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  Confidence: {expert.confidence}%
                </Badge>
                {expandedExperts[expertKey] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </CardHeader>
          
          {expandedExperts[expertKey] && (
            <CardContent className="space-y-4 pt-0">
              {expert.keyFindings && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Key Findings
                  </h4>
                  <ul className="space-y-1">
                    {expert.keyFindings.map((finding, idx) => (
                      <li key={idx} className="text-sm text-gray-700 pl-6">
                        • {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {expert.criticalRisks && expert.criticalRisks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    Critical Risks
                  </h4>
                  <div className="space-y-2">
                    {expert.criticalRisks.map((risk, idx) => (
                      <div key={idx} className="border border-red-200 rounded-lg p-3 bg-red-50">
                        <div className="flex items-start gap-2 mb-2 flex-wrap">
                          <Badge className="bg-red-600 text-white text-xs">
                            {risk.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {risk.likelihood} likelihood
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {risk.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{risk.description}</p>
                        <p className="text-xs text-gray-600">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {expert.concerns && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Concerns
                  </h4>
                  <ul className="space-y-1">
                    {expert.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-gray-700 pl-6">
                        • {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {expert.recommendations && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {expert.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-700 pl-6">
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
