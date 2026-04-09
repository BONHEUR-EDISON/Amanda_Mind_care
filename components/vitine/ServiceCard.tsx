'use client';
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  index: number;
}

export default function ServiceCard({ title, description, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300"
    >
      <h3 className="text-2xl font-serif mb-4 text-[#4A4A4A]">{title}</h3>
      <p className="text-[#4A4A4A]/80 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}