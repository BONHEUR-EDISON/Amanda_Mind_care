'use client';

import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  index: number;
  icon: React.ReactNode;
}

export default function ServiceCard({
  title,
  description,
  index,
  icon,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.25 },
      }}
      className="
        relative group rounded-3xl
        bg-white/70 backdrop-blur-xl
        border border-white/40
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        p-8 md:p-10
        overflow-hidden
      "
    >
      {/* glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6B9AC4]/20 blur-3xl rounded-full" />
      </div>

      {/* ICON */}
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#6B9AC4]/10 mb-6">
        <div className="text-[#6B9AC4]">{icon}</div>
      </div>

      {/* TITLE */}
      <h3 className="text-xl md:text-2xl font-serif text-[#2f2b28] mb-3">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-[#4A4A4A]/80 text-sm md:text-base leading-relaxed">
        {description}
      </p>

      {/* MICRO CTA */}
      <div className="mt-6 text-sm text-[#6B9AC4] opacity-0 group-hover:opacity-100 transition">
        Découvrir →
      </div>
    </motion.div>
  );
}