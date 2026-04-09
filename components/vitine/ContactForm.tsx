'use client';

import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-32 px-6 relative z-10 bg-[#F5F1EB]">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-[#4A4A4A]">
          {t("title")}
        </h2>

        <p className="text-[#4A4A4A]/80 mt-4 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* FORM */}
      <form className="max-w-xl mx-auto bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl space-y-5">

        <input
          className="w-full p-4 border border-[#dcdcdc] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]"
          placeholder={t("fields.name")}
        />

        <input
          className="w-full p-4 border border-[#dcdcdc] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]"
          placeholder={t("fields.email")}
        />

        <textarea
          className="w-full p-4 border border-[#dcdcdc] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]"
          rows={5}
          placeholder={t("fields.message")}
        />

        <button
          className="w-full bg-[#6B9AC4] text-white py-4 rounded-2xl hover:scale-105 transition-transform duration-300"
        >
          {t("fields.button")}
        </button>

      </form>
    </section>
  );
}