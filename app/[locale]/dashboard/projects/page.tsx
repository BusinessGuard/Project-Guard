'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { EmptyProjects } from './components/EmptyProjects';
import { AnonymousProjectCard } from './components/AnonymousProjectCard';
import { useTranslations } from 'next-intl';
import { getAnonymousProjectId } from '@/lib/utils/anonymousProject';

interface Project {
  id: string;
  name: string;
  industry?: string;
  stage?: string;
  created_at: string;
}

export default function ProjectsPage() {
  const t = useTranslations('project');
  const tNav = useTranslations('nav');
  const tProjectsPage = useTranslations('dashboard.projectsPage');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [anonymousProjectId, setAnonymousProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = `${tNav('appName')} | ${t('list')}`;
  }, [t, tNav]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      // Check for anonymous project in localStorage
      const anonProjectId = getAnonymousProjectId();
      setAnonymousProjectId(anonProjectId);

      // Load user projects if authenticated
      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setProjects(data || []);
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 pt-25">
        <div className="max-w-7xl mx-auto flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">{tProjectsPage('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-25">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('list')}</h1>
          <Link href="/create">
            <Button>{t('create')}</Button>
          </Link>
        </div>
        
        {projects.length === 0 && !anonymousProjectId ? (
          <EmptyProjects isAuthenticated={!!isAuthenticated} />
        ) : (
          <>
            {/* Show anonymous project card for authenticated users */}
            {isAuthenticated && anonymousProjectId && <AnonymousProjectCard />}
            
            {/* Show anonymous project as a card for non-authenticated users */}
            {!isAuthenticated && anonymousProjectId && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">{t('yourProject')}</h2>
                <Link
                  href={`/dashboard/projects/${anonymousProjectId}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold">{t('anonymousProject')}</h3>
                  <p className="text-sm text-gray-600 mt-1">{t('clickToView')}</p>
                </Link>
              </div>
            )}
            
            {/* Show user projects if any */}
            {projects.length > 0 && (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      {project.industry && <span>{project.industry}</span>}
                      {project.stage && <span>• {project.stage}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
