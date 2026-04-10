'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';
import { locales } from '@/lib/locales';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>('');

  const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => setMounted(true), []);

  // Scroll behavior
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrolled(currentY > 20);
          setHidden(currentY > lastY && currentY > 80);
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section spy
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach(sec => observer.observe(sec));
    return () => sections.forEach(sec => observer.unobserve(sec));
  }, []);

  if (!mounted) return null;

  const currentLocale = pathname.split('/')[1] || 'fr';
  const currentLang = locales.find(l => l.code === currentLocale) || locales[0];

  const changeLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/'));
    localStorage.setItem('lang', locale);
  };

  const navItems = [
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500
        ${
          scrolled
            ? 'bg-white/80 dark:bg-black/60 backdrop-blur-2xl shadow-lg border-b border-black/5 dark:border-white/10'
            : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-md group-hover:scale-105 transition">
            <Image
              src="/images/logo.png"
              alt="Amanda Mind Care Logo"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>

          <span
            className={`font-serif text-xl tracking-wide transition ${
              scrolled ? 'text-black dark:text-white' : 'text-black/90 dark:text-white/90'
            }`}
          >
            Amanda Mind Care
          </span>
        </a>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map(item => {
            const id = item.href.replace('#', '');
            const isActive = active === id;

            return (
              <a
                key={item.key}
                href={item.href}
                className={`relative transition ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-black/80 dark:text-white/80 hover:text-cyan-400'
                }`}
              >
                {t(item.key)}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-cyan-400 transition-all ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:scale-110 transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* LANGUAGE */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10"
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
                  className="absolute right-0 mt-3 w-48 bg-white dark:bg-black border rounded-xl shadow-xl"
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

          {/* MOBILE */}
          <button className="md:hidden text-2xl" onClick={() => setOpen(true)}>
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
            className="fixed inset-0 z-[60] bg-black text-white flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="logo" width={28} height={28} />
                <span className="font-serif text-lg">Amanda Mind Care</span>
              </div>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="flex flex-col gap-6">
              {navItems.map(item => (
                <a key={item.key} href={item.href} onClick={() => setOpen(false)}>
                  {t(item.key)}
                </a>
              ))}
            </div>

            <div className="mt-12 space-y-3">
              {locales.map(l => (
                <button
                  key={l.code}
                  onClick={() => {
                    changeLanguage(l.code);
                    setOpen(false);
                  }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>

            <div className="mt-auto">
              <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#6B9AC4] to-cyan-400">
                {t('cta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}