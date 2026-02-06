'use client';

import { CiLogout } from "react-icons/ci";
import { Menu } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScoreboardState } from '@/store/useState';
import { NavigationMenu } from './NavigationMenu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface MobileHeaderProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export function MobileHeader({ isAuthenticated, onSignOut }: MobileHeaderProps) {
  const { isSheetOpen, setIsSheetOpen } = useScoreboardState();

  return (
    <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Link 
        href="/dashboard" 
        className="text-xl font-bold text-black"
      >
        AI Guard
      </Link>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-8" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-gray-200">
            <SheetTitle className="text-2xl font-bold text-black text-left">
              AI Guard
            </SheetTitle>
          </SheetHeader>
          
          <div className="p-4 flex-1">
            <NavigationMenu 
              isAuthenticated={isAuthenticated} 
              onItemClick={() => setIsSheetOpen(false)} 
            />
          </div>
          
          <div className="p-4 mt-auto  border-gray-200 space-y-4">
            <Button
              onClick={() => {
                onSignOut();
                setIsSheetOpen(false);
              }}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 h-13 shadow-none"
            >
              <CiLogout className="size-6" />
              <span>Sign Out</span>
            </Button>
            <div className="w-full flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
