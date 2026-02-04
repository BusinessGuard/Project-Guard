'use client';

import { useRouter } from 'next/navigation';
import { NotFoundContent } from '@/components/NotFoundContent';

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard/projects');
    }
  };

  return <NotFoundContent onBack={handleBack} />;
}
