'use client';

import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { NavigationMenu } from './NavigationMenu';
import { SignOutButton } from './SignOutButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface DesktopSidebarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function DesktopSidebar({ isAuthenticated, isAdmin }: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col p-4 z-10">
      <div className="py-6">
        <Link href="/dashboard" className="cursor-pointer">
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

      <NavigationMenu isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

      <div className="mt-auto mb-4">
        <SignOutButton isAuthenticated={isAuthenticated} />
        <div className="w-full flex mt-2 justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
