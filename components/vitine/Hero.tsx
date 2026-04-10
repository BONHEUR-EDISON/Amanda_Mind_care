'use client';

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  easeOut,
  type Variants
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('hero');
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.7,
        ease: easeOut,
      },
    }),
  };

  return (
    <section
      ref={ref}
      className="
        relative min-h-screen flex items-center overflow-hidden
        bg-[#070A0F]
      "
    >

      {/* BACKGROUND IMAGE */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt={t('imageAlt')}
          fill
          priority
          className="object-cover scale-105 hidden md:block"
        />

        <Image
          src="/images/bg-hero-mob2.jpg"
          alt={t('imageAlt')}
          fill
          priority
          className="object-cover scale-105 md:hidden"
        />
      </motion.div>

      {/* OVERLAY CLEAN */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-5xl px-5 sm:px-10 md:px-16 py-24 flex flex-col gap-5">

        {/* BADGE */}
        <motion.div
          custom={0}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="
            inline-flex w-fit
            px-4 py-1.5
            rounded-full
            text-[11px] sm:text-xs
            bg-white/10 backdrop-blur-xl
            border border-white/15
            text-white/80 tracking-wide
          "
        >
          {t('badge')}
        </motion.div>

        {/* TITLE */}
        <motion.h1
          custom={1}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="
            font-serif font-medium leading-tight
            text-white
            text-3xl sm:text-5xl md:text-7xl
            tracking-tight
          "
        >
          {t('title')}
        </motion.h1>

        {/* SUBTITLE (CLEAN MOBILE STACK) */}
        <motion.div
          custom={2}
          variants={textVariant}
          className="
            text-white/80
            text-base sm:text-xl md:text-3xl
            leading-snug sm:leading-relaxed
          "
        >
          {t('subtitle1')}{" "}
          <span className="text-white/60">
            {t('subtitle2')}
          </span>
        </motion.div>

        {/* DESCRIPTION */}
        <motion.p
          custom={3}
          variants={textVariant}
          className="
            text-white/60
            text-sm sm:text-base md:text-lg
            max-w-xl leading-relaxed
          "
        >
          {t('description')}
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={4}
          variants={textVariant}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2"
        >
          <button className="
            px-6 sm:px-8 py-3
            rounded-full
            bg-[#6B9AC4] hover:bg-[#A8D5BA]
            text-white font-medium
            transition
          ">
            {t('ctaPrimary')}
          </button>

          <button className="
            px-6 sm:px-8 py-3
            rounded-full
            border border-white/20
            text-white
            backdrop-blur-xl
            hover:bg-white/10
            transition
          ">
            {t('ctaSecondary')}
          </button>
        </motion.div>

        {/* Trust */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="flex gap-6 mt-6 text-gray-300 text-sm"
        >
          <span>{t('trust1')}</span>
          <span>{t('trust2')}</span>
          <span>{t('trust3')}</span>
        </motion.div>

      </div>
    </section>
  );
}