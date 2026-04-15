'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/lib/navigation';
import { createClient } from '@/lib/supabase/client';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileHeader } from './components/MobileHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      <DesktopSidebar 
        isAuthenticated={isAuthenticated} 
        onSignOut={handleSignOut} 
      />

      <div className="flex flex-col lg:ml-64">
        <MobileHeader 
          isAuthenticated={isAuthenticated} 
          onSignOut={handleSignOut} 
        />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
