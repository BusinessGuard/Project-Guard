'use client';
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from 'react';

import { usePathname, useRouter } from '@/lib/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
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

  const menuItems = [
    { href: '/dashboard/projects', label: t('projects'), icon: '📁', authRequired: false },
    { href: '/dashboard/settings', label: t('settings'), icon: '⚙️', authRequired: true },
    { href: '/dashboard/billing', label: 'Billing', icon: '💳', authRequired: true },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/projects') {
      return pathname?.startsWith('/dashboard/projects');
    }
    return pathname === href;
  };

  return (
    <div className="flex min-h-screen ">
      {isAuthenticated && (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
          <div className="p-6 border-b border-gray-200">
            <Link 
              href="/dashboard" 
              className="text-2xl font-bold text-black cursor-pointer"
            >
              ProjectGuard AI
            </Link>
          </div>
          <nav className="flex-1  space-y-2">
            {menuItems
              .filter(item => !item.authRequired || isAuthenticated)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
          </nav>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 my-20  cursor-pointer px-4 h-13 shadow-none "
          >
            <CiLogout className="size-6" />
            <span>Sign Out</span>
          </Button>
        </aside>
      )}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
