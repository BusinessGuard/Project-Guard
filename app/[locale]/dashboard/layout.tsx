import { createClient } from '@/lib/supabase/server';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileHeader } from './components/MobileHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  let isAdmin = false;

  if (user) {
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = data?.role === 'admin';
  }

  return (
    <div className="min-h-screen">
      <DesktopSidebar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

      <div className="flex flex-col lg:ml-64">
        <MobileHeader isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
