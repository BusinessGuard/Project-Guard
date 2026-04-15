'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';

interface ErrorProps {
  error: string;
}
export function Error({ error }: ErrorProps) {
  const t = useTranslations('dashboard.error');
  const tProject = useTranslations('project');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md space-y-4">
        <p className="text-lg text-red-600 font-semibold">{t('title')}: {error}</p>
        {error.includes('not authenticated') && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              {t('refreshMessage')}
            </p>
            <Link 
              href="/" 
              className="inline-block text-sm text-blue-600 hover:underline"
            >
              {t('goToHome')}
            </Link>
          </div>
        )}
        {error.includes('No projects found') && (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              {t('noProjectsMessage')}
            </p>
            <Link 
              href="/create" 
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-black/90"
            >
              {tProject('create')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}