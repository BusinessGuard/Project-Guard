'use client';

import { CiLogout } from "react-icons/ci";
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { NavigationMenu } from './NavigationMenu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface DesktopSidebarProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export function DesktopSidebar({ isAuthenticated, onSignOut }: DesktopSidebarProps) {
  const tAuth = useTranslations('auth');
  
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col p-4 z-10">
      <div className="p-6 border-b border-gray-200">
        <Link 
          href="/dashboard" 
          className="text-2xl font-bold text-black cursor-pointer"
        >
          AI Guard
        </Link>
      </div>
      
      <NavigationMenu isAuthenticated={isAuthenticated} />
      
      <div className="mt-auto mb-4">
        <Button
          onClick={onSignOut}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 h-13 shadow-none"
        >
          <CiLogout className="size-6" />
          <span>{tAuth('signOut')}</span>
        </Button>
        <div className="w-full flex  mt-2 justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
