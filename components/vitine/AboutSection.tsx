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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const textVariant: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 px-6 bg-[#F5F1EB] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* IMAGE */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative rounded-3xl shadow-2xl overflow-hidden border border-[#e5e5e5]"
        >
          <Image
            src="/images/about.png"
            alt="Amanda Mind Care"
            width={600}
            height={400}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-6 relative z-10"
        >
          <motion.h2
            custom={0}
            variants={textVariant}
            className="text-4xl md:text-5xl font-serif text-[#2f2b28]"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            custom={1}
            variants={textVariant}
            className="text-[#4A4A4A]/90 text-lg md:text-xl leading-relaxed"
          >
            {t("paragraph1")}
          </motion.p>

          <motion.p
            custom={2}
            variants={textVariant}
            className="text-[#4A4A4A]/80 text-md md:text-lg leading-relaxed"
          >
            {t("paragraph2")}
          </motion.p>

          <motion.div custom={3} variants={textVariant} className="mt-6">
            <button
              className="bg-[#6B9AC4] text-white px-8 py-3 rounded-full 
              hover:bg-[#A8D5BA] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t("cta")}
            </button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}