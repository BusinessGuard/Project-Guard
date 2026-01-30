'use client';

import { useEffect, useState } from 'react';
import { ScoreboardHeader } from './components/ScoreboardHeader';
import { ProjectHeader } from './components/ProjectHeader';
import { ScoreCard } from './components/ScoreCard';
import { VersionHistory } from './components/VersionHistory';
import { StrengthsWeaknesses } from './components/StrengthsWeaknesses';
import { TabsSection } from './components/tabs/TabsSection';
import { useAnalizeStore } from '@/store/useAnalizeStore';
import { useScoreboardState } from '@/store/useState';
import { loadFirstProjectWithVersions } from '@/lib/utils/loadProjectData';
import { Error } from './components/Error'; 
import { LoadingScreen } from '../create/components/LoadingScreen';
export default function ScoreboardPage() {
  const { setProject, setVersions, setAnalysis } = useAnalizeStore();
  const { setActiveVersion, setExistingVersions, setProjectInfo, setOverallScore } = useScoreboardState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        const { project, versions, firstVersionAnalysis, versionsWithDbIds } = await loadFirstProjectWithVersions();
        
        if (project) {
          // Set project in analysis store
          setProject(project);
          setVersions(versions);
          
          setProjectInfo(project.name, project.industry, project.stage);
          
          if (versionsWithDbIds.length > 0) {
            const versionList = versionsWithDbIds.map(v => ({
              id: v.dbId,
              version: v.version,
              score: v.score,
              name: v.name,
              date: v.date,
            }));
            setExistingVersions(versionList);
            setActiveVersion(versionsWithDbIds[0].version);
          }
          
          if (firstVersionAnalysis) {
            setAnalysis(firstVersionAnalysis);
            setOverallScore(firstVersionAnalysis.scores.overall);
          } else if (versions.length > 0) {
            setError('Analysis not found for the first version');
          }
        } else {
          setError('No projects found. Create your first project to get started.');
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Unknown error';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [setProject, setVersions, setAnalysis, setActiveVersion, setExistingVersions, setProjectInfo, setOverallScore]);

  if (loading) return <LoadingScreen text="Loading project..." />;
  if (error) return <Error error={error} />;

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
