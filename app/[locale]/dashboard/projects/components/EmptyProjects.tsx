'use client';

import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function EmptyProjects({ isAuthenticated }: { isAuthenticated: boolean }) {
  const t = useTranslations('dashboard.emptyProjects');
  const tProject = useTranslations('project');
  const tAuth = useTranslations('auth');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-gray-900">{t('title')}</h2>
          <p className="text-gray-600 text-lg">
            {isAuthenticated 
              ? t('authenticatedMessage')
              : t('unauthenticatedMessage')
            }
          </p>
        </div>
        {isAuthenticated ? (
          <Link href="/create">
            <Button size="lg" className="text-base px-8">
              {tProject('create')}
            </Button>
          </Link>
        ) : (
          <Link href="/">
            <Button size="lg" className="text-base px-8">
              {tAuth('createAccount')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
