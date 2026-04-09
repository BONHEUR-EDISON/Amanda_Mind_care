'use client';

import ProcessStep from "./ProcessStep";
import { useTranslations } from "next-intl";

export default function ProcessSection() {
  const t = useTranslations("process");

  const steps = t.raw("steps") as {
    title: string;
    description: string;
  }[];

  return (
    <section className="py-32 px-6 bg-[#F5F1EB] relative z-10">
      
      {/* HEADER */}
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-serif text-[#4A4A4A] mb-3">
          {t("title")}
        </h2>

        <p className="text-[#4A4A4A]/80 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* STEPS */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <ProcessStep
            key={i}
            number={i + 1}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
}