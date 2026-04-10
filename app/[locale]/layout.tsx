import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/config/i18n';

const messagesMap = {
  fr: () => import('../../messages/fr.json').then(m => m.default),
  en: () => import('../../messages/en.json').then(m => m.default),
  rw: () => import('../../messages/rw.json').then(m => m.default),
  es: () => import('../../messages/es.json').then(m => m.default),
  zu: () => import('../../messages/zu.json').then(m => m.default),
  cn: () => import('../../messages/cn.json').then(m => m.default),
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) notFound();

  const messages =
    await messagesMap[locale as keyof typeof messagesMap]();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}