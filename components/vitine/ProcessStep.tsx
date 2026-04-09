'use client';
import { motion } from "framer-motion";
import { CheckCircle, Phone, Heart } from "lucide-react";

interface Props {
  number: number;
  title: string;
  description: string;
}

const icons = [Phone, CheckCircle, Heart];

export default function ProcessStep({ number, title, description }: Props) {
  const Icon = icons[number - 1] || Phone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-transform duration-300"
    >
      <div className="w-16 h-16 mx-auto mb-6 bg-[#6B9AC4] text-white rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-serif mb-3 text-[#4A4A4A]">{title}</h3>
      <p className="text-[#4A4A4A]/80 text-md leading-relaxed">{description}</p>
    </motion.div>
  );
}