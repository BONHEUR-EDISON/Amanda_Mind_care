import { locales } from "@/config/i18n";

export function getPreferredLocale(
  acceptLanguage?: string | null,
  savedLocale?: string | null
) {
  // 1. priorité utilisateur
  if (savedLocale && locales.includes(savedLocale as any)) {
    return savedLocale;
  }

  if (!acceptLanguage) return "fr";

  // 2. parsing navigateur
  const preferred = acceptLanguage
    .split(",")
    .map(l => l.split(";")[0].trim().toLowerCase());

  for (const lang of preferred) {
    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("rw")) return "rw";
    if (lang.startsWith("es")) return "es";
  }

  return "fr";
}