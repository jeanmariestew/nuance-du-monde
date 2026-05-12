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
  return (
    <main className="min-h-screen">
      <Header />
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
