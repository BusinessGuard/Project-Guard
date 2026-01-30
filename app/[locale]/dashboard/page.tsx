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
          
          // Set project info in scoreboard state
          setProjectInfo(project.name, project.industry, project.stage);
          
          // Set versions in scoreboard state
          if (versionsWithDbIds.length > 0) {
            const versionList = versionsWithDbIds.map(v => ({
              id: v.dbId,
              version: v.version,
              score: v.score,
              name: v.name,
              date: v.date,
            }));
            setExistingVersions(versionList);
            
            // Set first version as active
            setActiveVersion(versionsWithDbIds[0].version);
          }
          
          // Load and set analysis for first version
          if (firstVersionAnalysis) {
            setAnalysis(firstVersionAnalysis);
            setOverallScore(firstVersionAnalysis.scores.overall);
          } else if (versions.length > 0) {
            setError('Analysis not found for the first version');
          }
        } else {
          setError('No projects found. Create your first project to get started.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [setProject, setVersions, setAnalysis, setActiveVersion, setExistingVersions, setProjectInfo, setOverallScore]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md space-y-4">
          <p className="text-lg text-red-600 font-semibold">Error: {error}</p>
          {error.includes('not authenticated') && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Please try refreshing the page or sign in again.
              </p>
              <a 
                href="/" 
                className="inline-block text-sm text-blue-600 hover:underline"
              >
                Go to home page
              </a>
            </div>
          )}
          {error.includes('No projects found') && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                Create your first project to get started.
              </p>
              <a 
                href="/create" 
                className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-black/90"
              >
                Create Project
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

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
