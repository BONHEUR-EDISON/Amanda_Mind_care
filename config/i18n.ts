// i18n.ts
export const locales = ['fr', 'en', 'rw', 'es', 'zu', 'cn', 'ar'] as const;
export const defaultLocale = 'fr';
export type Locale = typeof locales[number];