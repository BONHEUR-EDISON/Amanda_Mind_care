'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { locales } from '@/lib/locales';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { getUserSafe } from '@/lib/auth/getUserSafe'; // 🔥 FIX IMPORTANT

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const langRef = useRef<HTMLDivElement>(null);

  const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => setMounted(true), []);

  // =========================
  // 🔐 SAFE AUTH (NO SUPABASE LOCK)
  // =========================
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const u = await getUserSafe(); // ✅ SAFE CALL

      if (mounted) {
        setUser(u);
      }
    };

    loadUser();

    // ⚠️ LISTENER SAFE (NO getUser HERE)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // =========================
  // LANGUAGE
  // =========================
  const currentLocale = pathname.split('/')[1] || 'fr';

  const currentLang =
    locales.find(l => l.code === currentLocale) || locales[0];

  const changeLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
    localStorage.setItem('lang', locale);
  };

  // =========================
  // SCROLL EFFECT
  // =========================
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // =========================
  // OUTSIDE CLICK LANG MENU
  // =========================
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================
  // MOBILE SCROLL LOCK
  // =========================
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  // =========================
  // ESC CLOSE
  // =========================
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setLangOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ];

  return (
    <header
      className={`
        fixed top-0 w-full z-[120]
        transition-all duration-300
        bg-[#F8FAFC]
        md:bg-[#F8FAFC]/80
        ${scrolled ? 'shadow-sm border-b border-gray-200 backdrop-blur-xl' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* ================= LOGO ================= */}
        <a href="#" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/images/logo.png"
              alt="Aurion Mental Health Clinic"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="font-serif text-lg md:text-xl font-semibold text-[#0B0F14]">
            Aurion Mental Health Clinic
          </span>
        </a>

        {/* ================= NAV DESKTOP ================= */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className="relative text-gray-700 hover:text-[#6B9AC4]"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        {/* ================= ACTIONS ================= */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white border border-gray-200"
          >
            {isDark ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-gray-700" />
            )}
          </button>

          {/* LANGUAGE */}
          <div ref={langRef} className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-[150]"
                >
                  {locales.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AUTH DESKTOP */}
          {!user ? (
            <>
              <button onClick={() => router.push('/login')} className="hidden md:block">
                Login
              </button>

              <button onClick={() => router.push('/signup')} className="hidden md:block">
                Sign up
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/patient')} className="hidden md:block">
                Dashboard
              </button>

              <button onClick={handleLogout} className="hidden md:block">
                Logout
              </button>
            </>
          )}

          {/* MOBILE MENU BTN */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[299] bg-[#EAF0F6]"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[300] flex flex-col bg-[#F8FAFC] p-8"
            >
              <div className="flex justify-between mb-10">
                <span className="font-serif">Aurion Mental Health Clinic</span>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <div className="flex flex-col gap-6">
                {navItems.map(item => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </a>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3">
                {!user ? (
                  <>
                    <button onClick={() => router.push('/login')} className="py-3 border rounded-full">
                      Login
                    </button>

                    <button onClick={() => router.push('/signup')} className="py-3 bg-[#6B9AC4] text-white rounded-full">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => router.push('/patient')} className="py-3 border rounded-full">
                      Dashboard
                    </button>

                    <button onClick={handleLogout} className="py-3 bg-red-500 text-white rounded-full">
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}