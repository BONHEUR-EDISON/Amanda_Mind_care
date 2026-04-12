import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import AutoLogoutProvider from "@/components/AutoLogoutProvider";

export const metadata: Metadata = {
  title: "Aurion Mental Health Clinic - Espace Privé de Psychologie",
  description:
    "Un accompagnement confidentiel et professionnel pour votre équilibre mental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* 🔐 AUTO LOGOUT GLOBAL */}
        <AutoLogoutProvider>
          {children}
        </AutoLogoutProvider>

      </body>
    </html>
  );
}
