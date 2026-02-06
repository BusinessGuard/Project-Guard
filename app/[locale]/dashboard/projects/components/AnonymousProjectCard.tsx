'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function AnonymousProjectCard() {
  const t = useTranslations('dashboard.anonymousProject');
  const { data: project, isLoading } = useQuery({
    queryKey: ['anonymous-project'],
    queryFn: async () => {
      const anonymousProjectId = localStorage.getItem('anonymous_project_id');
      
      if (!anonymousProjectId) {
        return null;
      }
      
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', anonymousProjectId)
        .single();
      
      if (error) {
        console.error('Error fetching anonymous project:', error);
        return null;
      }
      
      return data;
    },
  });

  const handleTransfer = async () => {
    if (!project) return;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { error } = await supabase
        .from('projects')
        .update({ user_id: user.id })
        .eq('id', project.id)
        .is('user_id', null);
      
      if (error) {
        console.error('Error transferring project:', error);
      } else {
        console.log('✅ Project transferred successfully');
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to transfer project:', error);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!project) {
    return null;
  }

  // Don't show if project already has a user
  if (project.user_id !== null) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{t('title')}</h2>
      <div className="p-4 border rounded-lg ">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              {project.industry && <span>{project.industry}</span>}
              {project.stage && <span>• {project.stage}</span>}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('description')}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button onClick={handleTransfer} size="sm">
              {t('addToAccount')}
            </Button>
            <Link href={`/dashboard/projects/${project.id}`}>
              <Button variant="outline" size="sm">
                {t('view')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
