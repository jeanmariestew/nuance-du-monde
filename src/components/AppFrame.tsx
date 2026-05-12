"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfessionalProvider } from "@/contexts/ProfessionalContext";

// AppFrame: rend Header/Footer partout sauf dans l'espace /admin
export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isBrochure = pathname?.startsWith("/brochure_2026");

  if (isAdmin || isBrochure) {
    return <>{children}</>;
  }
  return (
    <ProfessionalProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ProfessionalProvider>
  );
}
