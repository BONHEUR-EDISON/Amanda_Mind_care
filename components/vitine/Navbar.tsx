'use client';

import { useEffect, useState, useRef } from 'react';
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

  const langRef = useRef<HTMLDivElement>(null);

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

  // Scroll propre
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

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquer scroll mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }, [open]);

  // ESC close
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

        /* 🌿 BASE CLAIRE DOUCE */
        bg-[#F8FAFC]

        /* 💻 GLASS DOUX */
        md:bg-[#F8FAFC]/80

        ${scrolled
          ? 'shadow-sm border-b border-gray-200 backdrop-blur-xl'
          : ''
        }
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

          <span className="font-serif text-lg md:text-xl font-semibold text-[#0B0F14]">
            Aurion Mental Health Clinic
          </span>
        </a>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className="relative text-gray-700 hover:text-[#6B9AC4] transition"
            >
              {t(item.key)}

              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#6B9AC4] transition-all hover:w-full" />
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white border border-gray-200 hover:scale-110 transition"
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
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700"
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

          {/* CTA */}
          <button className="hidden md:block px-5 py-2 rounded-full bg-[#6B9AC4] text-white shadow-sm hover:bg-[#5a89b2] transition">
            {t('cta')}
          </button>

          {/* MOBILE BTN */}
          <button
            className="md:hidden text-2xl text-gray-800"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
     <AnimatePresence>
  {open && (
    <>
      {/* BACKDROP SOLIDE (cache totalement la page) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[299] bg-[#EAF0F6]"
      />

      {/* MENU PANEL */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="
          fixed inset-0 z-[300]
          flex flex-col
          bg-[#F8FAFC]
          text-[#0B0F14]
          p-8
        "
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <span className="font-serif text-lg text-[#0B0F14]">
            Aurion Mental Health Clinic
          </span>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-gray-700"
          >
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
              className="
                text-lg
                text-gray-700
                hover:text-[#6B9AC4]
                transition
              "
            >
              {t(item.key)}
            </a>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="my-10 border-t border-gray-200" />

        {/* LANGUAGE */}
        <div className="flex flex-col gap-3">
          {locales.map(l => (
            <button
              key={l.code}
              onClick={() => {
                changeLanguage(l.code);
                setOpen(false);
              }}
              className="
                flex items-center gap-3
                text-gray-600
                hover:text-[#6B9AC4]
                transition
              "
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* CTA BOTTOM FIXED */}
        <div className="mt-auto pt-10">
          <button className="
            w-full py-3
            rounded-full
            bg-[#6B9AC4]
            text-white
            font-medium
            shadow-sm
            hover:bg-[#5a89b2]
            transition
          ">
            {t('cta')}
          </button>
        </div>

      </motion.div>
    </>
  )}
</AnimatePresence>
    </header>
  );
}