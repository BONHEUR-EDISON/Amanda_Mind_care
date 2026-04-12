// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, '', options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl.clone();

  // =========================
  // NO USER
  // =========================
  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // =========================
  // PROFILE
  // =========================
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active, is_blocked')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !profile.is_active || profile.is_blocked) {
    url.pathname = '/blocked';
    return NextResponse.redirect(url);
  }

  const role = profile.role;

  // =========================
  // ROLE GUARD
  // =========================
  if (url.pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/therapist') && role !== 'therapist') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/patient') && role !== 'patient') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return res;
}

// =========================
// MATCHER PROPRE
// =========================
export const config = {
  matcher: ['/admin/:path*', '/therapist/:path*', '/patient/:path*'],
};