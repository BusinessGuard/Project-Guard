"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/lib/navigation';
import { locales, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { LuLanguages } from 'react-icons/lu';

const languageShortNames: Record<Locale, string> = {
  en: 'EN',
  ru: 'RU',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    // Switch to the other locale
    const newLocale = locale === 'en' ? 'ru' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button 
      variant="ghost" 
      className="gap-1 px-3"
      onClick={toggleLocale}
    >
      <LuLanguages className="h-4 w-4" />
      <span className="text-sm font-medium">{languageShortNames[locale]}</span>
    </Button>
  );
}
