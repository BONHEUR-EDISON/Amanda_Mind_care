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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
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
      className="relative min-h-screen flex items-center overflow-hidden bg-[#F5F1EB]"
    >

      {/* BACKGROUND IMAGE */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt={t('imageAlt')}
          fill
          priority
          className="object-cover scale-105 opacity-80 hidden md:block"
        />

        <Image
          src="/images/bg-hero-mob2.jpg"
          alt={t('imageAlt')}
          fill
          priority
          className="object-cover scale-105 opacity-80 md:hidden"
        />
      </motion.div>

      {/* SOFT OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B1A2A]/80 via-[#0B1A2A]/60 to-transparent" />

      {/* LIGHT EFFECT */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#A8D5BA30] blur-[120px] z-10" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#6B9AC430] blur-[120px] z-10" />

      {/* CONTENT */}
      <div className="relative z-20 w-full max-w-5xl px-6 sm:px-10 md:px-16 py-24 flex flex-col gap-6">

        {/* LOGO MINI */}
        <motion.div
          custom={0}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3"
        >
          <Image src="/logo1.png" alt="logo" width={36} height={36} />
          <span className="text-white/90 font-serif tracking-wide text-lg">
            Amanda Mind Care
          </span>
        </motion.div>

        {/* BADGE */}
        <motion.div
          custom={1}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="inline-flex w-fit px-4 py-1.5 rounded-full text-xs bg-white/10 backdrop-blur-xl border border-white/20 text-white/80"
        >
          {t('badge')}
        </motion.div>

        {/* TITLE */}
        <motion.h1
          custom={2}
          variants={textVariant}
          initial="hidden"
          animate="visible"
          className="font-serif leading-tight text-white text-3xl sm:text-5xl md:text-6xl tracking-tight"
        >
          {t('title')}
        </motion.h1>

        {/* SUBTITLE */}
        <motion.div
          custom={3}
          variants={textVariant}
          className="text-white/80 text-base sm:text-xl md:text-2xl leading-relaxed"
        >
          {t('subtitle1')}{" "}
          <span className="text-[#A8D5BA]">
            {t('subtitle2')}
          </span>
        </motion.div>

        {/* DESCRIPTION */}
        <motion.p
          custom={4}
          variants={textVariant}
          className="text-white/60 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed"
        >
          {t('description')}
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={5}
          variants={textVariant}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <button className="
            px-8 py-3 rounded-full
            bg-gradient-to-r from-[#6B9AC4] to-[#A8D5BA]
            text-white font-medium shadow-lg
            hover:scale-105 transition
          ">
            {t('ctaPrimary')}
          </button>

          <button className="
            px-8 py-3 rounded-full
            border border-white/30
            text-white backdrop-blur-xl
            hover:bg-white/10 transition
          ">
            {t('ctaSecondary')}
          </button>
        </motion.div>

        {/* TRUST */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-wrap gap-6 mt-6 text-white/60 text-sm"
        >
          <span>✔ {t('trust1')}</span>
          <span>✔ {t('trust2')}</span>
          <span>✔ {t('trust3')}</span>
        </motion.div>

      </div>
    </section>
  );
}