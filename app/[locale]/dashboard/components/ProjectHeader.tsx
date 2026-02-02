'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVersionsStore } from '@/store/useVersionsStore';

export function ProjectHeader() {
  const { currentProject, audienceType, setAudienceType, version } = useVersionsStore();
  
  if (!currentProject) return null;
  
  const { name, industry, stage } = currentProject;

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{name || 'Project'}</h1>
        <div className="flex items-center text-sm">{industry || 'N/A'} | {stage || 'N/A'}</div>
      </div>

      <Tabs value={audienceType} onValueChange={(value) => setAudienceType(value as 'venture' | 'bank' | 'corporate')}>
        <TabsList className="!h-auto border">
          <TabsTrigger value="venture" className="flex flex-col items-start px-8 py-2 gap-1">
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
