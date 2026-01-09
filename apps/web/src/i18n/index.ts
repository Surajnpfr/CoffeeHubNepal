import { en, type SupportedLanguage } from './en';
import { ne } from './ne';

export const translations: Record<SupportedLanguage, Record<string, any>> = {
  en,
  ne,
};

export type { SupportedLanguage };

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function t(
  lang: SupportedLanguage,
  key: string,
  fallback?: string
): string {
  const parts = key.split('.');
  let current: any = translations[lang];

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current === 'string') {
    return current;
  }

  // Fallback to English if available
  if (lang !== 'en') {
    let fallbackCurrent: any = translations.en;
    for (const part of parts) {
      if (fallbackCurrent && typeof fallbackCurrent === 'object' && part in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[part];
      } else {
        fallbackCurrent = undefined;
        break;
      }
    }
    if (typeof fallbackCurrent === 'string') {
      return fallbackCurrent;
    }
  }

  return fallback ?? key;
}


