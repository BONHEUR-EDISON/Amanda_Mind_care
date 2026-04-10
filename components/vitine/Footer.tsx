'use client';

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const navItems = t.raw("navigation.items") as string[];

  return (
    <footer className="relative bg-[#F8FAFC] text-gray-700 px-6 pt-24 pb-10 overflow-hidden">

      {/* SUBTLE NEURO GLOW (very light, medical style) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-[#6B9AC4]/10 blur-[160px] top-[-150px] left-[-150px]" />
        <div className="absolute w-[400px] h-[400px] bg-[#A8D5BA]/10 blur-[140px] bottom-[-150px] right-[-150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h3 className="text-[#0B0F14] font-serif text-3xl mb-4 tracking-wide">
            Aurion Mental Health Clinic
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
            {t("description")}
          </p>

          {/* TRUST BADGE */}
          <div className="mt-6 inline-flex items-center gap-2 text-xs text-gray-600 border border-gray-200 px-3 py-1 rounded-full bg-white/60 backdrop-blur">
            <span className="w-2 h-2 bg-[#6B9AC4] rounded-full animate-pulse" />
            Neuroscience-based clinical standard
          </div>
        </div>

        {/* NAV */}
        <div>
          <h4 className="text-[#0B0F14] mb-5 font-medium tracking-wide">
            {t("navigation.title")}
          </h4>

          <ul className="space-y-3 text-sm">
            {navItems.map((item, i) => (
              <li key={i}>
                <a className="group flex items-center gap-2 cursor-pointer">
                  <span className="w-0 h-[1px] bg-[#6B9AC4] transition-all duration-300 group-hover:w-6"></span>

                  <span className="text-gray-600 group-hover:text-[#0B0F14] transition-all duration-300">
                    {item}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-[#0B0F14] mb-5 font-medium tracking-wide">
            {t("contact.title")}
          </h4>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="hover:text-[#0B0F14] transition">
              {t("contact.email")}
            </li>
            <li className="hover:text-[#0B0F14] transition">
              {t("contact.phone")}
            </li>
            <li className="hover:text-[#0B0F14] transition">
              {t("contact.location")}
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h4 className="text-[#0B0F14] mb-5 font-medium tracking-wide">
            {t("social.title")}
          </h4>

          <div className="flex gap-4 mb-6">
            {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-11 h-11 flex items-center justify-center
                  rounded-full
                  bg-white
                  border border-gray-200
                  hover:bg-[#6B9AC4]/10
                  hover:border-[#6B9AC4]/30
                  transition-all duration-300
                  shadow-sm
                "
              >
                <Icon className="text-[#6B9AC4] text-sm" />
              </motion.a>
            ))}
          </div>

          <h4 className="text-[#0B0F14] mb-2 font-medium">
            {t("hours.title")}
          </h4>

          <ul className="space-y-1 text-sm text-gray-600">
            <li>{t("hours.week")}</li>
            <li>{t("hours.sat")}</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative mt-16 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">

        <p className="text-center md:text-left">
          {t("bottom.rights")}
        </p>

        <div className="flex gap-6">
          <span className="hover:text-[#0B0F14] cursor-pointer transition">
            {t("bottom.privacy")}
          </span>
          <span className="hover:text-[#0B0F14] cursor-pointer transition">
            {t("bottom.terms")}
          </span>
        </div>
      </div>
    </footer>
  );
}