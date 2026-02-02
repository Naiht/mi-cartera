import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import es from './es';
import en from './en';

export type Language = 'es' | 'en';

export const i18n = new I18n({
  es,
  en,
});

i18n.enableFallback = true;

/**
 * Detecta idioma del sistema
 */
export function getSystemLanguage(): Language {
  const locale = Localization.getLocales()[0]?.languageCode;
  return locale === 'en' ? 'en' : 'es';
}

/**
 * Inicializa el idioma (llamar una vez)
 */
export function initI18n(lang?: Language) {
  i18n.locale = lang ?? getSystemLanguage();
}

/**
 * Shortcut para traducciones
 */
export function t(key: string, options?: any): string {
  return i18n.t(key, options);
}
