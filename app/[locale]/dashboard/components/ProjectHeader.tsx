'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalizeStore } from '@/store/useAnalizeStore';
import { useScoreboardState } from '@/store/useState';

export function ProjectHeader() {
  const project = useAnalizeStore((state) => state.project);
  const { investorProfile, setInvestorProfile } = useScoreboardState();
  
  if (!project) return null;
  
  const { name: projectName, industry: projectIndustry, stage: projectStage } = project;

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{projectName}</h1>
        <div className="flex items-center text-sm">{projectIndustry} | {projectStage}
          
        </div>
      </div>

      <Tabs value={investorProfile} onValueChange={(value) => setInvestorProfile(value as 'vc' | 'bank' | 'corporate')}>
        <TabsList className="!h-auto border">
          <TabsTrigger value="vc" className="flex flex-col items-start px-8 py-2 gap-1">
            <span className="text-base font-semibold">🚀 Venture Capital</span>
            <span className="text-xs text-muted-foreground font-normal">Growth & scalability focus</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex flex-col items-start px-8 py-2 gap-1">
            <span className="text-base font-semibold">🏦 Bank Loan</span>
            <span className="text-xs text-muted-foreground font-normal">Financial stability focus</span>
          </TabsTrigger>
          <TabsTrigger value="corporate" className="flex flex-col items-start px-8 py-2 gap-1">
            <span className="text-base font-semibold">🏢 Corporate</span>
            <span className="text-xs text-muted-foreground font-normal">Partnership & synergy focus</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
