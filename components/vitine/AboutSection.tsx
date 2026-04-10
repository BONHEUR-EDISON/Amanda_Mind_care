'use client';

import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("about");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const textVariant: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.25,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 md:py-32 px-6 bg-[#F5F1EB] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 md:gap-16 items-center">

        {/* ================= IMAGE BLOCK ================= */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30"
        >

          {/* IMAGE MOBILE (portrait émotionnel clinique) */}
          <Image
            src="/images/about-mobile.jpg"
            alt="Therapy session mobile view"
            width={800}
            height={1000}
            className="block md:hidden object-cover w-full h-full"
            priority
          />

          {/* IMAGE DESKTOP (cabinet premium) */}
          <Image
            src="/images/about-mobile.jpg"
            alt="Luxury psychology clinic"
            width={1200}
            height={900}
            className="hidden md:block object-cover w-full h-full"
            priority
          />

          {/* OVERLAY SCIENTIFIC / NEUROSCIENCE FEEL */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />

          {/* LIGHT GLOW ACCENT */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6B9AC4]/30 blur-3xl rounded-full" />
        </motion.div>

        {/* ================= TEXT BLOCK ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-6 relative z-10"
        >

          {/* TITLE */}
          <motion.h2
            custom={0}
            variants={textVariant}
            className="text-4xl md:text-5xl font-serif text-[#2f2b28] leading-tight"
          >
            {t("title")}
          </motion.h2>

          {/* PARAGRAPH 1 */}
          <motion.p
            custom={1}
            variants={textVariant}
            className="text-[#4A4A4A]/90 text-lg md:text-xl leading-relaxed"
          >
            {t("paragraph1")}
          </motion.p>

          {/* PARAGRAPH 2 */}
          <motion.p
            custom={2}
            variants={textVariant}
            className="text-[#4A4A4A]/80 text-base md:text-lg leading-relaxed"
          >
            {t("paragraph2")}
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={3}
            variants={textVariant}
            className="mt-6"
          >
            <button
              className="
                bg-[#6B9AC4] text-white px-8 py-3 rounded-full
                hover:bg-[#A8D5BA] transition-all duration-300
                shadow-lg hover:shadow-xl
              "
            >
              {t("cta")}
            </button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}