'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RightNav() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // 📊 SCROLL TRACKING
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🧠 CTA INTELLIGENT
  const getMainAction = () => {
    if (scrollY < 500) return 'Découvrir';
    if (scrollY < 1200) return 'Réserver';
    return 'Contacter';
  };

  const mainLabel = getMainAction();

  const actions = [
    {
      icon: Calendar,
      label: mainLabel,
      color: 'from-[#6B9AC4] to-cyan-400',
      primary: true,
      onClick: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'from-green-500 to-emerald-400',
      badge: true,
      onClick: () => {
        window.open('https://wa.me/250XXXXXXXXX', '_blank');
      }
    },
    {
      icon: Phone,
      label: 'Appeler',
      color: 'from-purple-500 to-pink-400',
      onClick: () => {
        window.location.href = 'tel:+250XXXXXXXXX';
      }
    }
  ];

  return (
    <>
      {/* DESKTOP */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={index}
                  onHoverStart={() => setHovered(index)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={action.onClick}
                  className="cursor-pointer"
                >
                  <motion.div
                    initial={{ width: 55 }}
                    animate={{ width: hovered === index ? 180 : 55 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`relative flex items-center overflow-hidden rounded-full
                      backdrop-blur-2xl
                      ${action.primary
                        ? 'bg-white dark:bg-black shadow-2xl scale-105'
                        : 'bg-white/70 dark:bg-black/70 shadow-lg'}
                    `}
                  >
                    {/* ICON */}
                    <div className={`min-w-[55px] h-[55px] flex items-center justify-center
                      bg-gradient-to-r ${action.color} text-white`}>
                      <Icon size={20} />
                    </div>

                    {/* TEXT */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hovered === index ? 1 : 0 }}
                      className="px-4 text-sm font-medium text-gray-800 dark:text-white"
                    >
                      {action.label}
                    </motion.span>

                    {/* BADGE */}
                    {action.badge && (
                      <span className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">

        <div className="flex items-center gap-4 px-4 py-3 rounded-full
          backdrop-blur-xl bg-white/90 dark:bg-black/90 shadow-xl border">

          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <button
                key={index}
                onClick={action.onClick}
                className="relative flex flex-col items-center text-xs"
              >
                <div className={`p-3 rounded-full bg-gradient-to-r ${action.color} text-white`}>
                  <Icon size={18} />
                </div>

                {action.badge && (
                  <span className="absolute top-1 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                )}

                <span className="mt-1 text-gray-700 dark:text-white">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}