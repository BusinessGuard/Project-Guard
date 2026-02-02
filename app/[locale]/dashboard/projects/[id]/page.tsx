import { getVersions } from '@/lib/utils/getVersions';
import { ProjectDetailClient } from './ProjectDetailClient';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const versions = await getVersions(id);

  return (
    <ProjectDetailClient versions={versions} />
  );
}
