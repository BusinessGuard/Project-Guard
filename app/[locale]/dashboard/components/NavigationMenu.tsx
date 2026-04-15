'use client';

import { Link, usePathname } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

interface NavigationMenuProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onItemClick?: () => void;
}

export function NavigationMenu({ isAuthenticated, isAdmin, onItemClick }: NavigationMenuProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tAdmin = useTranslations('admin');

  const menuItems = [
    { href: '/dashboard/projects', label: t('projects'), icon: '📁', authRequired: false, adminOnly: false },
    { href: '/dashboard/admin/users', label: tAdmin('title'), icon: '🛡️', authRequired: true, adminOnly: true },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/projects') {
      return pathname?.startsWith('/dashboard/projects');
    }
    if (href === '/dashboard/admin/users') {
      return pathname?.startsWith('/dashboard/admin');
    }
    return pathname === href;
  };

  const visibleItems = menuItems.filter(item => {
    if (item.authRequired && !isAuthenticated) return false;
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="flex-1 space-y-2">
      {visibleItems.map((item) => (
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
          <span className="text-xl">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
