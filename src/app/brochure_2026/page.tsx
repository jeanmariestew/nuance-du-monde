"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfessional } from "@/contexts/ProfessionalContext";
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Stats } from "@/components/landing/stats"
import { CommercialTool } from "@/components/landing/commercial-tool"
import { TravelTypes } from "@/components/landing/travel-types"
import { BrochureBenefits } from "@/components/landing/brochure-benefits"
import { Features } from "@/components/landing/features"
import { Destinations } from "@/components/landing/destinations"
import { HowToReceive } from "@/components/landing/how-to-receive"
import { Testimonials } from "@/components/landing/testimonials"
import { OrderForm } from "@/components/landing/order-form"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function BrochurePage() {
  const { session, isLoading } = useProfessional();
  const router = useRouter();

  // Si pas connecté, rediriger vers la page d'accueil avec modal d'auth
  useEffect(() => {
    if (!isLoading && !session?.isAuthenticated) {
      router.push('/?auth=1');
    }
  }, [isLoading, session?.isAuthenticated, router]);

  // Pendant le chargement ou si pas connecté, afficher un loader
  if (isLoading || !session?.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Header sticky={true} />
      <Hero />
      <Stats />
      <CommercialTool />
      <TravelTypes />
      <BrochureBenefits />
      <Features />
      <Destinations />
      <HowToReceive />
      <Testimonials />
      <OrderForm />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
