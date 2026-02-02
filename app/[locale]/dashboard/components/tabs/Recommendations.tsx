'use client';

import { useState, useEffect } from 'react';
import { useVersionsStore } from '@/store/useVersionsStore';
import { useScoreboardState } from '@/store/useState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export function Recommendations() {
  const { currentProject } = useVersionsStore();
  const { recommendationsProgress, setRecommendationsProgress } = useScoreboardState();
  const [expandedRecommendations, setExpandedRecommendations] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<string, Set<number>>>({});
  
  if (!currentProject?.analysis) return null;
  
  const analysis = currentProject.analysis;
  
  useEffect(() => {
    const restored: Record<string, Set<number>> = {};
    Object.keys(recommendationsProgress).forEach(key => {
      restored[key] = new Set(recommendationsProgress[key]);
    });
    setCheckedSteps(restored);
  }, [recommendationsProgress]);
  
  if (!analysis) return null;
  
  const toggleRecommendation = (recId: string): void => {
    setExpandedRecommendations(prev => ({
      ...prev,
      [recId]: !prev[recId]
    }));
  };
  
  const toggleStep = (recId: string, stepIdx: number): void => {
    setCheckedSteps(prev => {
      const current = prev[recId] || new Set<number>();
      const updated = new Set(current);
      if (updated.has(stepIdx)) {
        updated.delete(stepIdx);
      } else {
        updated.add(stepIdx);
      }
      const newState = { ...prev, [recId]: updated };
      
      const toSave: Record<string, number[]> = {};
      Object.keys(newState).forEach(key => {
        toSave[key] = Array.from(newState[key]);
      });
      setRecommendationsProgress(toSave);
      
      return newState;
    });
  };
  
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };
  
  const getPriorityBorderColor = (priority: string): string => {
    switch (priority) {
      case 'CRITICAL': return 'border-l-red-600';
      case 'HIGH': return 'border-l-orange-500';
      case 'MEDIUM': return 'border-l-yellow-500';
      default: return 'border-l-gray-400';
    }
  };
  
  const recommendations = analysis.recommendations.list;
  
  const getProgress = (recId: string, totalSteps: number) => {
    const completed = checkedSteps[recId]?.size || 0;
    return { completed, total: totalSteps };
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 text-xs text-gray-500">
        {recommendations.map((rec) => {
          const progress = getProgress(rec.id, rec.actionSteps.length);
          return (
            <span key={rec.id}>
              {rec.title}: {progress.completed}/{progress.total}
            </span>
          );
        })}
      </div>
      
      {recommendations.map((rec) => (
        <Card key={rec.id} className={`border-l-8 relative shadow-none ${getPriorityBorderColor(rec.priority)}`}>
          <CardContent className="">
            <Badge className={`${getPriorityColor(rec.priority)} text-white !text-xs flex-shrink-0 absolute -top-[1px] rounded-none rounded-tr-lg rounded-bl-lg -right-0 `}>
              {rec.priority}
            </Badge>
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <div 
                  className="cursor-pointer"
                  onClick={() => toggleRecommendation(rec.id)}
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
                      <div className=" pl-10 py-4 pb-8">
                        {rec.actionSteps.map((step, idx) => (
                          <label key={idx} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-4 rounded ">
                            <Checkbox
                              className="size-5"
                              checked={checkedSteps[rec.id]?.has(idx) || false}
                              onCheckedChange={() => toggleStep(rec.id, idx)}
                            />
                            <span className="font-[500] text-base">{step}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                     <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg">
                        <div className="flex flex-wrap gap-4 text-sm ">
                          {[
                            { label: 'Expected Impact', value: rec.expectedImpact },
                            { label: 'Effort', value: rec.effort },
                            { label: 'Timeline', value: rec.timeline },
                          ].map((item, idx) => (
                            <div key={idx}>
                              <span className="font-medium">{item.label}:</span>
                              <span className="text-gray-600 ml-2">{item.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-xs text-gray-500">
                          Supported by {rec.expertsSupporting.length}/6 experts
                        </div>
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
