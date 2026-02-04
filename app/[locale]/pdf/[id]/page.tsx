import { createClient } from '@/lib/supabase/server';
import { getVersions } from '@/lib/utils/getVersions';
import { notFound } from 'next/navigation';
import { PDFPreviewClient } from './PDFPreviewClient';

export default async function PDFPreviewPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ version?: string; audience?: string }>;
}) {
  const { id } = await params;
  const { version, audience } = await searchParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthorized = !!user;

  let versions;
  try {
    versions = await getVersions(id);
  } catch (error: any) {
    notFound();
  }
  
  // Parse version and audience from query params
  const selectedVersion = version ? parseInt(version, 10) : 1;
  const selectedAudience = (audience as 'venture' | 'bank' | 'corporate') || 'venture';

  return (
    <PDFPreviewClient 
      versions={versions}
      initialVersion={selectedVersion}
      initialAudience={selectedAudience}
      isAuthorized={isAuthorized}
    />
  );
}
