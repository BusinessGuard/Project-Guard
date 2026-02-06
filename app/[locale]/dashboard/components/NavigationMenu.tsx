'use client';

import Link from 'next/link';
import { usePathname } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

interface NavigationMenuProps {
  isAuthenticated: boolean;
  onItemClick?: () => void;
}

export function NavigationMenu({ isAuthenticated, onItemClick }: NavigationMenuProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const menuItems = [
    { href: '/dashboard/projects', label: t('projects'), icon: '📁', authRequired: false },
    // Temporarily hidden
    // { href: '/dashboard/settings', label: t('settings'), icon: '⚙️', authRequired: true },
    // { href: '/dashboard/billing', label: 'Billing', icon: '💳', authRequired: true },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/projects') {
      return pathname?.startsWith('/dashboard/projects');
    }
    return pathname === href;
  };

  return (
    <nav className="flex-1 space-y-2">
      {menuItems
        .filter(item => !item.authRequired || isAuthenticated)
        .map((item) => (
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
