'use client';
import Navbar from "@/components/vitine/Navbar";
import Hero from "@/components/vitine/Hero";
import ServicesSection from "@/components/vitine/ServicesSection";
import AboutSection from "@/components/vitine/AboutSection";
import ProcessSection from "@/components/vitine/ProcessSection";
import TestimonialsSection from "@/components/vitine/TestimonialsSection";
import ContactForm from "@/components/vitine/ContactForm";
import Footer from "@/components/vitine/Footer";

export default function Home() {
  return (
    <main className="bg-[#f8f6f3] text-[#2d2a26]">
      <Navbar />
      <Hero />
      <ServicesSection />
      <AboutSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactForm />
      <Footer />
      
    </main>
  );
}