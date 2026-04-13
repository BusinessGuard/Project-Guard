"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { localeNames, type Locale } from '@/i18n/config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LuLanguages } from 'react-icons/lu';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-auto gap-1 border-none shadow-none bg-transparent px-3">
        <LuLanguages className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(localeNames) as [Locale, string][]).map(([key, name]) => (
          <SelectItem key={key} value={key}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
