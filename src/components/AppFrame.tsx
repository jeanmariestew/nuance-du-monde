"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProfessionalProvider } from "@/contexts/ProfessionalContext";

// AppFrame: rend Header/Footer partout sauf dans l'espace /admin et /brochure_2026
export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isBrochure = pathname?.startsWith("/brochure_2026");

  // /admin: sans provider, sans header/footer
  if (isAdmin) {
    return <>{children}</>;
  }

  // /brochure_2026: avec provider (pour useProfessional), mais sans header/footer globaux
  if (isBrochure) {
    return (
      <ProfessionalProvider>
        {children}
      </ProfessionalProvider>
    );
  }

  // Partout ailleurs: avec provider, header et footer
  return (
    <ProfessionalProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ProfessionalProvider>
  );
}
