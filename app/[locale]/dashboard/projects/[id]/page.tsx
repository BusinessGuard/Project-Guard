import { getVersions } from '@/lib/utils/getVersions';
import { createClient } from '@/lib/supabase/server';
import { ProjectDetailClient } from './ProjectDetailClient';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('id', id)
    .single();

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'dashboard.projectHeader' });
  const projectName = project?.name ?? t('defaultProjectName');

  return {
    title: projectName,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthorized = !!user;

  const versions = await getVersions(id);

  return <ProjectDetailClient versions={versions} isAuthorized={isAuthorized} />
}
