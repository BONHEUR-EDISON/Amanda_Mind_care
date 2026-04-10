'use client';

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Props {
  text: string;
  author: string;
  className?: string;
}

export default function TestimonialCard({
  text,
  author,
  className = "",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative group
        bg-white/70 backdrop-blur-xl
        border border-white/40
        rounded-3xl
        p-8 md:p-10
        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
        overflow-hidden
        text-center
        ${className}
      `}
    >
      {/* glow hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#6B9AC4]/20 blur-3xl rounded-full" />
      </div>

      {/* quote icon */}
      <div className="flex justify-center mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#6B9AC4]/10 flex items-center justify-center">
          <Quote className="w-6 h-6 text-[#6B9AC4]" />
        </div>
      </div>

      {/* TEXT */}
      <p className="italic text-[#4A4A4A]/90 text-base md:text-lg leading-relaxed mb-6">
        “{text}”
      </p>

      {/* AUTHOR */}
      <span className="text-[#4A4A4A]/70 font-medium text-sm md:text-base">
        — {author}
      </span>
    </motion.div>
  );
}