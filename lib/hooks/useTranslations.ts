// Re-export next-intl hooks for easier imports
export { useTranslations, useLocale, useMessages } from 'next-intl';

// Type-safe translation keys helper
export type TranslationKey = 
  | `common.${string}`
  | `nav.${string}`
  | `auth.${string}`
  | `project.${string}`
  | `analysis.${string}`
  | `errors.${string}`;
