'use client';

import { useEffect } from 'react';
import { useRouter } from '@/lib/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/projects');
  }, [router]);

  return null;
}
