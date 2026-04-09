'use client';

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  const navItems = t.raw("navigation.items") as string[];

  return (
    <footer className="relative bg-[#1f1d1a] text-gray-300 px-6 pt-20 pb-10 overflow-hidden">

      {/* Glow background effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-[#6B9AC4] blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[300px] h-[300px] bg-[#a8c0d6] blur-[100px] bottom-[-100px] right-[-100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h3 className="text-white font-serif text-3xl mb-4 tracking-wide">
            Amanda Mind Care
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            {t("description")}
          </p>
        </div>

        {/* NAV */}
        <div>
          <h4 className="text-white mb-4 font-medium">
            {t("navigation.title")}
          </h4>

          <ul className="space-y-3 text-sm">
            {navItems.map((item, i) => (
              <li key={i}>
                <a className="group flex items-center gap-2 cursor-pointer">
                  <span className="w-0 h-[1px] bg-[#6B9AC4] transition-all duration-300 group-hover:w-4"></span>
                  <span className="text-gray-400 group-hover:text-[#6B9AC4] transition-all duration-300">
                    {item}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white mb-4 font-medium">
            {t("contact.title")}
          </h4>

          <ul className="space-y-3 text-sm text-gray-400">
            <li className="hover:text-[#6B9AC4] transition">
              {t("contact.email")}
            </li>
            <li className="hover:text-[#6B9AC4] transition">
              {t("contact.phone")}
            </li>
            <li className="hover:text-[#6B9AC4] transition">
              {t("contact.location")}
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h4 className="text-white mb-4 font-medium">
            {t("social.title")}
          </h4>

          <div className="flex gap-4 mb-6">
            {[FaFacebookF, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-full 
                bg-white/5 backdrop-blur-md border border-white/10
                hover:bg-[#6B9AC4]/20 hover:border-[#6B9AC4]/40
                transition-all duration-300"
              >
                <Icon className="text-gray-300 text-sm" />
              </motion.a>
            ))}
          </div>

          <h4 className="text-white mb-2 font-medium">
            {t("hours.title")}
          </h4>

          <ul className="space-y-1 text-sm text-gray-400">
            <li>{t("hours.week")}</li>
            <li>{t("hours.sat")}</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="relative mt-16 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>{t("bottom.rights")}</p>

        <div className="flex gap-6">
          <span className="hover:text-[#6B9AC4] cursor-pointer transition">
            {t("bottom.privacy")}
          </span>
          <span className="hover:text-[#6B9AC4] cursor-pointer transition">
            {t("bottom.terms")}
          </span>
        </div>
      </div>
    </footer>
  );
}