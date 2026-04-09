'use client';

import { motion } from "framer-motion";
import { Brain, HeartHandshake, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [Brain, HeartHandshake, Sparkles];

export default function ServicesSection() {
  const t = useTranslations("services");

  const services = t.raw("items") as {
    title: string;
    description: string;
  }[];

  return (
    <section id="services" className="py-32 px-6 relative bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-[#2f2b28]"
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#4A4A4A]/80 text-lg mt-4 max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, i) => {
            const Icon = icons[i];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-2xl bg-white/60 backdrop-blur-md 
                border border-[#e5e5e5] hover:border-[#6B9AC4]/40 
                shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full 
                bg-[#6B9AC4]/10 mb-6 group-hover:bg-[#6B9AC4]/20 transition">
                  <Icon className="text-[#6B9AC4]" size={22} />
                </div>

                <h3 className="text-xl font-semibold text-[#2f2b28] mb-3">
                  {service.title}
                </h3>

                <p className="text-[#4A4A4A]/80 text-sm leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-6 text-sm text-[#6B9AC4] opacity-0 group-hover:opacity-100 transition">
                  {t("more")}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA GLOBAL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <button className="bg-[#6B9AC4] text-white px-8 py-3 rounded-full 
          hover:bg-[#A8D5BA] transition-all duration-300 shadow-md hover:shadow-lg">
            {t("cta")}
          </button>
        </motion.div>

      </div>
    </section>
  );
}