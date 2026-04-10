'use client';

import { motion } from "framer-motion";
import { CheckCircle, Phone, Heart } from "lucide-react";

interface Props {
  number: number;
  title: string;
  description: string;
}

const icons = [Phone, CheckCircle, Heart];

export default function ProcessStep({
  number,
  title,
  description,
}: Props) {
  const Icon = icons[number - 1] || Phone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.2 },
      }}
      className="
        relative group
        bg-white/70 backdrop-blur-xl
        border border-white/40
        rounded-3xl
        p-8 md:p-10
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        overflow-hidden
      "
    >
      {/* glow hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6B9AC4]/20 blur-3xl rounded-full" />
      </div>

      {/* ICON CIRCLE */}
      <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-[#6B9AC4]/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#6B9AC4]" />
      </div>

      {/* STEP NUMBER */}
      <div className="text-center text-xs text-[#6B9AC4] font-medium mb-2">
        STEP {number}
      </div>

      {/* TITLE */}
      <h3 className="text-xl md:text-2xl font-serif text-[#2f2b28] text-center mb-3">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-[#4A4A4A]/80 text-sm md:text-base leading-relaxed text-center">
        {description}
      </p>
    </motion.div>
  );
}