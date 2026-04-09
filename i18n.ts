import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config/i18n';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? defaultLocale;

  const safeLocale = locales.includes(resolvedLocale as any)
    ? resolvedLocale
    : defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
});