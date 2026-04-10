'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [loading, setLoading] = useState(false);

  return (
    <section
      id="contact"
      className="relative py-28 px-6 bg-[#0B0F14] overflow-hidden"
    >
      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-[#6B9AC4]/20 blur-[160px] top-[-150px] left-[-150px]" />
        <div className="absolute w-[400px] h-[400px] bg-[#A8D5BA]/10 blur-[140px] bottom-[-150px] right-[-150px]" />
      </div>

      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-white">
          {t("title")}
        </h2>

        <p className="text-white/60 mt-4 max-w-2xl mx-auto text-sm md:text-base">
          {t("subtitle")}
        </p>
      </motion.div>

      {/* FORM CARD (TRUST GLASS PANEL) */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="
          relative z-10 max-w-2xl mx-auto

          bg-white/5 backdrop-blur-2xl
          border border-white/10

          p-6 md:p-10 rounded-3xl
          shadow-2xl space-y-5
        "
      >

        {/* NAME */}
        <input
          className="
            w-full p-4 rounded-2xl
            bg-white/5 text-white placeholder-white/40
            border border-white/10

            focus:outline-none focus:ring-2 focus:ring-[#A8D5BA]
            transition
          "
          placeholder={t("fields.name")}
        />

        {/* EMAIL */}
        <input
          className="
            w-full p-4 rounded-2xl
            bg-white/5 text-white placeholder-white/40
            border border-white/10

            focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]
            transition
          "
          placeholder={t("fields.email")}
        />

        {/* MESSAGE */}
        <textarea
          rows={6}
          className="
            w-full p-4 rounded-2xl
            bg-white/5 text-white placeholder-white/40
            border border-white/10

            focus:outline-none focus:ring-2 focus:ring-[#A8D5BA]
            transition resize-none
          "
          placeholder={t("fields.message")}
        />

        {/* BUTTON */}
        <button
          type="button"
          onClick={() => setLoading(true)}
          className="
            w-full py-4 rounded-2xl

            bg-gradient-to-r from-[#6B9AC4] to-[#A8D5BA]

            text-white font-medium

            hover:scale-[1.02]
            transition-all duration-300

            shadow-lg
          "
        >
          {loading ? "Sending..." : t("fields.button")}
        </button>

        {/* SECURITY */}
        <p className="text-xs text-white/40 text-center mt-2">
          Secure encrypted communication • Confidential psychological care
        </p>

      </motion.form>
    </section>
  );
}