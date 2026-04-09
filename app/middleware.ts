import { NextRequest, NextResponse } from "next/server";
import { getPreferredLocale } from "../lib/getPreferredLocale";

const locales = ["fr", "en", "rw", "es"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignore assets
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // check locale already exists
  const pathnameLocale = pathname.split("/")[1];

  if (locales.includes(pathnameLocale)) {
    return NextResponse.next();
  }

  // detect browser language
  const acceptLanguage = req.headers.get("accept-language");

  const locale = getPreferredLocale(
    acceptLanguage,
    req.cookies.get("locale")?.value
  );

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const res = NextResponse.redirect(url);

  // persist cookie
  res.cookies.set("locale", locale);

  return res;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"]
};