'use client';

import { useEffect } from 'react';
import { ScoreboardHeader } from '../../components/ScoreboardHeader';
import { ProjectHeader } from '../../components/ProjectHeader';
import { ScoreCard } from '../../components/ScoreCard';
import { VersionHistory } from '../../components/VersionHistory';
import { StrengthsWeaknesses } from '../../components/StrengthsWeaknesses';
import { TabsSection } from '../../components/tabs/TabsSection';
import { useVersionsStore } from '@/store/useVersionsStore';
import { VersionsByAudience } from '@/lib/utils/getVersions';

export function ProjectDetailClient({ versions }: {
  versions: VersionsByAudience;
}) {
  const { setVersions, setVersion } = useVersionsStore();

  useEffect(() => {
    const versionNumbers = Object.keys(versions).map(Number).sort((a, b) => b - a);
    const latestVersionNumber = versionNumbers[0];
    
    setVersions(versions);
    
    if (latestVersionNumber) {
      setVersion(latestVersionNumber);
    }
  }, [versions, setVersions, setVersion]);

  return (
    <div className="min-h-screen bg-gray-50 pb-100">
      <ScoreboardHeader />
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <ProjectHeader />
        <ScoreCard />
        <VersionHistory />
        <StrengthsWeaknesses />
        <TabsSection />
      </div>
    </div>
  );
}
