'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useScoreboardState } from '@/store/useState';
import { NavigationMenu } from './NavigationMenu';
import { SignOutButton } from './SignOutButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface MobileHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function MobileHeader({ isAuthenticated, isAdmin }: MobileHeaderProps) {
  const { isSheetOpen, setIsSheetOpen } = useScoreboardState();

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="cursor-pointer">
        <div className="relative w-[140px] h-8">
          <Image
            src="/images/logo.png"
            alt="Project Guard AI"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-gray-200">
            <SheetTitle asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <div className="relative w-[180px] h-10">
                  <Image
                    src="/images/logo.png"
                    alt="Project Guard AI"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <div className="p-4 flex-1">
            <NavigationMenu
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              onItemClick={() => setIsSheetOpen(false)}
            />
          </div>

          <div className="p-4 mt-auto border-gray-200 space-y-4">
            <SignOutButton
              isAuthenticated={isAuthenticated}
              onSignOut={() => setIsSheetOpen(false)}
            />
            <div className="w-full flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
