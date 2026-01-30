'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Recommendation {
  id: string;
  priority: string;
  category: string;
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  effort: string;
  timeline: string;
  expertsSupporting: string[];
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
  expandedRecommendations: Record<string, boolean>;
  onToggleRecommendation: (recId: string) => void;
  getPriorityColor: (priority: string) => string;
}

export function RecommendationsList({
  recommendations,
  expandedRecommendations,
  onToggleRecommendation,
  getPriorityColor
}: RecommendationsListProps) {
  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <Card key={rec.id}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Badge className={`${getPriorityColor(rec.priority)} text-white flex-shrink-0`}>
                {rec.priority}
              </Badge>
              <div className="flex-1 space-y-3">
                <div 
                  className="cursor-pointer"
                  onClick={() => onToggleRecommendation(rec.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                    {expandedRecommendations[rec.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                </div>

                {expandedRecommendations[rec.id] && (
                  <>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Action Steps:</h4>
                      <div className="space-y-2">
                        {rec.actionSteps.map((step, idx) => (
                          <label key={idx} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input type="checkbox" className="mt-1" />
                            <span>{step}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2 text-sm">
                      <div>
                        <span className="font-medium">Expected Impact:</span>
                        <span className="text-gray-600 ml-2">{rec.expectedImpact}</span>
                      </div>
                      <div>
                        <span className="font-medium">Effort:</span>
                        <span className="text-gray-600 ml-2">{rec.effort}</span>
                      </div>
                      <div>
                        <span className="font-medium">Timeline:</span>
                        <span className="text-gray-600 ml-2">{rec.timeline}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Supported by {rec.expertsSupporting.length}/6 experts
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
