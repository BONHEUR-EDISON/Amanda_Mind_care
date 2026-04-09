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
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="py-32 px-6 bg-[#F5F1EB] text-center relative z-10">

      {/* HEADER */}
      <div className="mb-20">
        <h2 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] mb-3">
          {t("title")}
        </h2>

        <p className="text-[#4A4A4A]/80 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariant}
          >
            <TestimonialCard
              text={item.text}
              author={item.author}
              className="bg-white/90 rounded-2xl shadow-lg p-8 border border-white/20 hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
}