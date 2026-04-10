export type Locale = 'en' | 'ru' | 'uk';

export const locales: Locale[] = ['en', 'ru', 'uk'];
export const defaultLocale: Locale = 'en';  // Default language - English

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  uk: 'Українська',
};
