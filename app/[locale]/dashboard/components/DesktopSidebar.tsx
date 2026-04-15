'use client';

import Image from 'next/image';
import { CiLogout, CiLogin } from "react-icons/ci";
import { Link, useRouter } from '@/lib/navigation';
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
  const tNav = useTranslations('nav');
  
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col p-4 z-10">
        <div className="py-6">
          <Link 
            href="/dashboard" 
            className="cursor-pointer"
          >
            <div className="relative w-[220px] h-12">
              <Image
                src="/images/logo.png"
                alt="Project Guard AI"
                fill
                className="object-сover"
              />
            </div>
          </Link>
        </div>
      
      <NavigationMenu isAuthenticated={isAuthenticated} />
      
      <div className="mt-auto mb-4">
        {isAuthenticated ? (
          <Button
            onClick={onSignOut}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 h-13 shadow-none"
          >
            <CiLogout className="size-6" />
            <span>{tAuth('signOut')}</span>
          </Button>
        ) : (
          <Link href="/">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 h-13 shadow-none"
            >
              <CiLogin className="size-6" />
              <span>{tNav('home')}</span>
            </Button>
          </Link>
        )}
        <div className="w-full flex  mt-2 justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
