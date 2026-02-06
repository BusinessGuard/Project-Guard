'use client';

import { useEffect, useState } from 'react';
import { ScoreboardHeader } from '../../components/ScoreboardHeader';
import { ProjectHeader } from '../../components/ProjectHeader';
import { ScoreCard } from '../../components/ScoreCard';
import { VersionHistory } from '../../components/VersionHistory';
import { StrengthsWeaknesses } from '../../components/StrengthsWeaknesses';
import { TabsSection } from '../../components/tabs/TabsSection';
import { useVersionsStore } from '@/store/useVersionsStore';
import { VersionsByAudience } from '@/lib/utils/getVersions';

export function ProjectDetailClient({ versions, isAuthorized = false }: {
  versions: VersionsByAudience;
  isAuthorized?: boolean;
}) {
  const { setVersions, setVersion } = useVersionsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const versionNumbers = Object.keys(versions).map(Number).sort((a, b) => b - a);
    const latestVersionNumber = versionNumbers[0];
    
    setVersions(versions);
    
    if (latestVersionNumber) {
      setVersion(latestVersionNumber);
    }
  }, [versions, setVersions, setVersion]);

  if (!mounted) return null;

  return (
    <div className="bg-gray-50 pb-20">
      <ScoreboardHeader isAuthorized={isAuthorized} />
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 pt-10">
        <ProjectHeader />
        <ScoreCard />
        <VersionHistory isAuthorized={isAuthorized} />
        <StrengthsWeaknesses />
        <TabsSection />
      </div>
    </div>
  );
}
