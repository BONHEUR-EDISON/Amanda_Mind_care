'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/lib/locales';


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1] || 'fr';

  const changeLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;

    const newPath = segments.join('/');
    localStorage.setItem('lang', locale);

    router.push(newPath);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ];

  const currentLang =
    locales.find(l => l.code === currentLocale) || locales[0];

  /**
   * 🎯 LOGIQUE DE CONTRASTE AUTOMATIQUE
   * - header transparent => texte blanc
   * - header scroll => texte sombre
   * - garantit visibilité sur tous backgrounds
   */
  const textColor = scrolled ? 'text-[#2f2b28]' : 'text-white';
  const subTextColor = scrolled ? 'text-[#4A4A4A]' : 'text-white/90';
  const hoverColor = scrolled ? 'hover:text-[#6B9AC4]' : 'hover:text-[#A8D5BA]';

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${scrolled
          ? 'bg-[#F5F1EB]/80 backdrop-blur-xl shadow-md border-b border-white/20'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/images/logo.png"
            alt="Amanda Mind Care"
            className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
          />

          <span className={`font-serif text-xl tracking-wide transition-colors ${textColor}`}>
            Amanda Mind Care
          </span>
        </a>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className={`relative transition-colors duration-300 ${textColor} ${hoverColor}`}
            >
              {t(item.key)}

              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* LANGUAGE DROPDOWN */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                backdrop-blur-xl border transition
                ${scrolled
                  ? 'bg-white/60 text-[#2f2b28] border-gray-200'
                  : 'bg-white/10 text-white border-white/20'
                }
              `}
            >
              <span>{currentLang.flag}</span>
              <span className="font-medium">
                {currentLang.code.toUpperCase()}
              </span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="
                    absolute right-0 mt-3 w-52
                    bg-white/90 backdrop-blur-2xl
                    border border-gray-200
                    rounded-2xl shadow-xl overflow-hidden
                  "
                >
                  {locales.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className={`
                        flex items-center gap-3 w-full px-4 py-3 text-sm
                        hover:bg-gray-100 transition
                        ${currentLocale === l.code ? 'bg-gray-100 font-semibold' : ''}
                      `}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span>{l.label}</span>

                      {currentLocale === l.code && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-[#6B9AC4]" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <button
            className={`
              hidden md:block px-5 py-2 rounded-full shadow-sm transition
              ${scrolled
                ? 'bg-[#6B9AC4] text-white hover:bg-[#A8D5BA]'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }
            `}
          >
            {t('cta')}
          </button>

          {/* MOBILE */}
          <button className={`md:hidden text-2xl p-2 ${textColor}`} onClick={() => setOpen(true)}>
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
            className="fixed inset-0 bg-[#1f1d1a]/95 backdrop-blur-xl z-50 flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-10 text-white">
              <span className="font-serif text-lg">Amanda Mind Care</span>
              <button onClick={() => setOpen(false)} className="text-2xl">
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-6 text-white text-lg">
              {navItems.map(item => (
                <a key={item.key} href={item.href} onClick={() => setOpen(false)}>
                  {t(item.key)}
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 text-white">
              {locales.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    changeLanguage(l.code);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 text-lg"
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <button className="w-full bg-[#6B9AC4] py-3 rounded-full text-white">
                {t('cta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}