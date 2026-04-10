'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { locales } from '@/lib/locales';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const [isDarkBg, setIsDarkBg] = useState(false);

  const t = useTranslations('navbar');
  const router = useRouter();
  const pathname = usePathname();

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => setMounted(true), []);

  // 📌 SMART SCROLL
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      setHidden(currentY > lastY && currentY > 80);
      lastY = currentY;

      detectBackground();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 📌 ACTIVE SECTION
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

  // 🧠 AI DETECTION BACKGROUND
  const detectBackground = () => {
    const el = document.elementFromPoint(window.innerWidth / 2, 80);
    if (!el) return;

    const bg = window.getComputedStyle(el).backgroundColor;

    if (!bg) return;

    const rgb = bg.match(/\d+/g);
    if (!rgb) return;

    const [r, g, b] = rgb.map(Number);

    // luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    setIsDarkBg(brightness < 140);
  };

  useEffect(() => {
    detectBackground();
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

  // 🎨 AUTO STYLE
  const textColor = isDarkBg ? 'text-white' : 'text-gray-900';
  const navBg = isDarkBg
    ? 'bg-black/70 backdrop-blur-xl'
    : 'bg-white/80 backdrop-blur-xl';

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6B9AC4] to-cyan-400" />
          <span className={`font-serif text-xl font-semibold ${textColor}`}>
            Amanda Mind Care
          </span>
        </a>

        {/* NAV */}
        <nav className={`hidden md:flex items-center gap-8 text-sm ${textColor}`}>
          {navItems.map(item => {
            const id = item.href.replace('#', '');
            const isActive = active === id;

            return (
              <a
                key={item.key}
                href={item.href}
                className={`transition ${
                  isActive ? 'text-cyan-400' : ''
                }`}
              >
                {t(item.key)}
              </a>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-black/10 dark:bg-white/10"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="md:hidden text-2xl" onClick={() => setOpen(true)}>
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 bg-black text-white flex flex-col p-6"
          >
            <button onClick={() => setOpen(false)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}