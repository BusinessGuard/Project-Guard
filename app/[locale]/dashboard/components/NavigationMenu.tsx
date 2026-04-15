'use client';

import { Link, usePathname } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { FolderOpen, BarChart2, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavigationMenuProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onItemClick?: () => void;
}

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  authRequired: boolean;
  adminOnly: boolean;
}

export function NavigationMenu({ isAuthenticated, isAdmin, onItemClick }: NavigationMenuProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tAdmin = useTranslations('admin');
  const tStats = useTranslations('stats');

  const menuItems: MenuItem[] = [
    { href: '/dashboard/projects', label: t('projects'), icon: FolderOpen, authRequired: false, adminOnly: false },
    { href: '/dashboard/stats', label: tStats('navLabel'), icon: BarChart2, authRequired: false, adminOnly: false },
    { href: '/dashboard/admin/users', label: tAdmin('title'), icon: Shield, authRequired: true, adminOnly: true },
  ];

  const isActive = (href: string) => pathname?.startsWith(href) ?? false;

  const visibleItems = menuItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="flex-1 space-y-2">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="size-5 shrink-0" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
