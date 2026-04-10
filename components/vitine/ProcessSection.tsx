'use client';

import ProcessStep from "./ProcessStep";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ProcessSection() {
  const t = useTranslations("process");

  const steps = t.raw("steps") as {
    title: string;
    description: string;
  }[];

  return (
    <section className="relative py-24 md:py-32 px-6 bg-[#F5F1EB] overflow-hidden">

      {/* SOFT NEUROSCIENCE GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#6B9AC4]/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

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

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {steps.map((step, i) => (
            <ProcessStep
              key={i}
              number={i + 1}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}