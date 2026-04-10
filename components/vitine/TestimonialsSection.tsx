'use client';

import { motion, Variants } from "framer-motion";
import TestimonialCard from "./TestimonialCard";
import { useTranslations } from "next-intl";

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  const testimonials = t.raw("items") as {
    text: string;
    author: string;
  }[];

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section className="relative py-24 md:py-32 px-6 bg-[#F5F1EB] overflow-hidden">

      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#6B9AC4]/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-serif text-[#2f2b28] mb-3">
            {t("title")}
          </h2>

          <p className="text-[#4A4A4A]/80 text-base md:text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={cardVariant}
            >
              <TestimonialCard
                text={item.text}
                author={item.author}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}