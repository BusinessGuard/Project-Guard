import { createClient } from '@/lib/supabase/server';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { EmptyProjects } from './components/EmptyProjects';
import { AnonymousProjectCard } from './components/AnonymousProjectCard';
import { getTranslations } from 'next-intl/server';

async function getUserProjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id) 
    .order('created_at', { ascending: false });
  
  return data || [];
}

export default async function ProjectsPage() {
  const t = await getTranslations('project');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;
  
  const projects = await getUserProjects();

  if (projects.length === 0) {
    return <EmptyProjects isAuthenticated={isAuthenticated} />;
  }

  return (
    <>
      <div className="p-6 pt-25">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('list')}</h1>
            <Link href="/create">
              <Button>{t('create')}</Button>
            </Link>
          </div>
          
          {isAuthenticated && <AnonymousProjectCard />}
          
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">{project.name}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  {project.industry && <span>{project.industry}</span>}
                  {project.stage && <span>• {project.stage}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
