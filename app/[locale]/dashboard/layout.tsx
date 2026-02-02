'use client';

import { usePathname } from '@/lib/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const menuItems = [
    { href: '/dashboard/projects', label: t('projects'), icon: '📁' },
    { href: '/dashboard/settings', label: t('settings'), icon: '⚙️' },
    { href: '/dashboard/billing', label: 'Billing', icon: '💳' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/projects') {
      return pathname?.startsWith('/dashboard/projects');
    }
    return pathname === href;
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="text-2xl font-bold text-black">
            AI Guard
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
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
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
