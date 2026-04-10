'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { locales } from '@/lib/locales';
import Image from 'next/image';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => setMounted(true), []);

  const currentLocale = pathname.split('/')[1] || 'fr';

  const currentLang =
    locales.find(l => l.code === currentLocale) || locales[0];

  const changeLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
    localStorage.setItem('lang', locale);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        fixed top-0 w-full z-[100]
        transition-all duration-300

        /* 🔥 MOBILE = SOLIDE / DESKTOP = GLASS */
        bg-white dark:bg-black
        md:bg-white/80 md:dark:bg-black/70

        ${scrolled ? 'shadow-md border-b border-black/10 dark:border-white/10 backdrop-blur-xl' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
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

          <span className="font-serif text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Aurion Mental Health Clinic
          </span>
        </a>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className="relative text-gray-800 dark:text-white hover:text-cyan-500 transition"
            >
              {t(item.key)}

              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-cyan-400 transition-all hover:w-full" />
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:scale-110 transition"
          >
            {isDark ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-800" />
            )}
          </button>

          {/* LANGUAGE DESKTOP */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 text-gray-800 dark:text-white"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-52 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl shadow-xl"
                >
                  {locales.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <button className="hidden md:block px-5 py-2 rounded-full bg-gradient-to-r from-[#6B9AC4] to-cyan-400 text-white shadow-lg hover:scale-105 transition">
            {t('cta')}
          </button>

          {/* MOBILE BTN */}
          <button
            className="md:hidden text-2xl text-gray-900 dark:text-white"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex flex-col p-8 bg-black text-white"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif text-lg">
                Aurion Mental Health Clinic
              </span>

              <button onClick={() => setOpen(false)} className="text-2xl">
                ✕
              </button>
            </div>

            {/* NAV */}
            <div className="flex flex-col gap-6">
              {navItems.map(item => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-white/70 hover:text-white transition"
                >
                  {t(item.key)}
                </a>
              ))}
            </div>

            {/* LANG MOBILE */}
            <div className="mt-12 space-y-3">
              {locales.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    changeLanguage(l.code);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition"
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#6B9AC4] to-[#A8D5BA] text-white">
                {t('cta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}