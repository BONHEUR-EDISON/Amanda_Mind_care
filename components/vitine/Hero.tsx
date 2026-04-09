'use client';

import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('hero');

  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // ✅ FIX typage + ease
  const textVariant: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: (i: number = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.25,
        duration: 0.8,
        ease: "easeOut" as const, // 🔥 FIX
      },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#F5F1EB]"
    >
      {/* PARALLAX IMAGE */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt={t('imageAlt')}
          fill
          priority
          className="object-cover object-center scale-105"
        />
      </motion.div>

      {/* OVERLAY */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[#0f172a]/10"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-3xl px-6 md:px-16 py-24 flex flex-col gap-5">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block w-fit px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gray-100 text-xs tracking-wide"
        >
          {t('badge')}
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={0}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-serif leading-tight text-gray-100"
        >
          {t('title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          custom={1}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-3xl font-light text-gray-200"
        >
          {t('subtitle1')}
        </motion.h2>

        <motion.h2
          custom={2}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="text-xl md:text-3xl font-light text-gray-200"
        >
          {t('subtitle2')}
        </motion.h2>

        {/* Description */}
        <motion.p
          custom={3}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="text-base md:text-lg text-gray-300 mt-2 max-w-xl leading-relaxed"
        >
          {t('description')}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button className="bg-[#6B9AC4] text-white px-8 py-3 rounded-full shadow-lg hover:bg-[#A8D5BA] transition-all duration-300">
            {t('ctaPrimary')}
          </motion.button>

          <motion.button className="border border-gray-400 text-gray-100 px-8 py-3 rounded-full backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            {t('ctaSecondary')}
          </motion.button>
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