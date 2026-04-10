'use client';

import { motion } from "framer-motion";
import { Brain, HeartHandshake, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import ServiceCard from "./ServiceCard";

const icons = [Brain, HeartHandshake, Sparkles];

export default function ServicesSection() {
  const t = useTranslations("services");

  const services = t.raw("items") as {
    title: string;
    description: string;
  }[];

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 px-6 bg-[#F5F1EB] overflow-hidden"
    >
      {/* soft background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-[#6B9AC4]/10 blur-[120px] -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif text-[#2f2b28]"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#4A4A4A]/80 text-base md:text-lg mt-4 max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {services.map((service, i) => {
            const Icon = icons[i];

            return (
              <ServiceCard
                key={i}
                index={i}
                title={service.title}
                description={service.description}
                icon={<Icon size={22} />}
              />
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <button
            className="
              px-8 py-3 rounded-full
              bg-[#6B9AC4] text-white
              hover:bg-[#A8D5BA]
              transition-all duration-300
              shadow-lg hover:shadow-xl
            "
          >
            {t("cta")}
          </button>
        </motion.div>

      </div>
    </section>
  );
}