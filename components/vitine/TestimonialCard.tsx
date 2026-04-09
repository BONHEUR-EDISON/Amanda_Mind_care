'use client';

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Props {
  text: string;
  author: string;
  className?: string; // ✅ AJOUT
}

export default function TestimonialCard({ text, author, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl 
      hover:shadow-3xl transition-all duration-300 flex flex-col items-center 
      text-center ${className}`} // ✅ fusion propre
    >
      <Quote className="w-10 h-10 text-[#6B9AC4] mb-4" />
      
      <p className="italic text-[#4A4A4A]/90 mb-6 text-lg leading-relaxed">
        &quot;{text}&quot;
      </p>

      <span className="text-[#4A4A4A]/70 font-medium">
        — {author}
      </span>
    </motion.div>
  );
}