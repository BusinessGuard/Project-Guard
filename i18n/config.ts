export type Locale = 'en' | 'ru';

export const locales: Locale[] = ['en', 'ru'];
export const defaultLocale: Locale = 'en';  // Default language - English

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
};
