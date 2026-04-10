'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { locales } from '@/lib/locales';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

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

  const navItems = [
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ];

  /**
   * 🧠 NEUROSCIENCE DESIGN SYSTEM LOGIC
   */
  const isElevated = scrolled || isDark;

  return (
    <header
      className={`
        fixed top-0 w-full z-50 transition-all duration-300

        ${scrolled
          ? 'bg-white/60 dark:bg-black/40 backdrop-blur-2xl shadow-md border-b border-white/10'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B9AC4] to-cyan-400 blur-[0.5px]" />
          <span className="font-serif text-xl text-white dark:text-white">
            Amanda Mind Care
          </span>
        </a>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map(item => (
            <a
              key={item.key}
              href={item.href}
              className="
                relative text-white/80 hover:text-cyan-300
                transition-colors duration-300
              "
            >
              {t(item.key)}
              <span className="
                absolute left-0 -bottom-1 h-[1px] w-0
                bg-cyan-300 transition-all hover:w-full
              " />
            </a>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="
              p-2 rounded-full
              bg-white/10 backdrop-blur-xl
              border border-white/10
              hover:bg-white/20 transition
            "
          >
            {isDark ? (
              <Sun size={18} className="text-yellow-300" />
            ) : (
              <Moon size={18} className="text-white" />
            )}
          </button>

          {/* LANGUAGE */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="
                flex items-center gap-2 px-4 py-2 rounded-full
                bg-white/10 backdrop-blur-xl
                border border-white/10
                text-white
              "
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="
                    absolute right-0 mt-3 w-52
                    bg-black/60 backdrop-blur-2xl
                    border border-white/10
                    rounded-2xl overflow-hidden
                  "
                >
                  {locales.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangOpen(false);
                      }}
                      className="
                        w-full flex items-center gap-3 px-4 py-3
                        text-white hover:bg-white/10 transition
                      "
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
          <button
            className="
              hidden md:block px-5 py-2 rounded-full
              bg-gradient-to-r from-[#6B9AC4] to-cyan-400
              text-white shadow-lg shadow-cyan-500/20
              hover:scale-[1.03] transition
            "
          >
            {t('cta')}
          </button>

          {/* MOBILE */}
          <button
            className="md:hidden text-2xl text-white"
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
            className="
              fixed inset-0 z-50 flex flex-col p-8
              bg-black/95 backdrop-blur-2xl text-white
            "
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-serif text-lg">
                Amanda Mind Care
              </span>
              <button onClick={() => setOpen(false)} className="text-2xl">
                ✕
              </button>
            </div>

            {navItems.map(item => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-lg text-white/80 hover:text-cyan-300"
              >
                {t(item.key)}
              </a>
            ))}

            <div className="mt-10 space-y-3">
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
              <button className="
                w-full py-3 rounded-full
                bg-gradient-to-r from-[#6B9AC4] to-cyan-400
                text-white
              ">
                {t('cta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}