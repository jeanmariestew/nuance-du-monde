"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Destination, TravelType, TravelTheme } from "@/types";
import HeroAnimated from "@/components/HeroAnimated";
import TravelTypesHero from "@/components/TravelTypesHero";
import TravelTypesSection from "@/components/TravelTypesSection";
import DestinationsSection from "@/components/DestinationsSection";
import ThemesSection from "@/components/ThemesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection";
import { api } from "@/lib/axios";
import AnimatedBentoGrid from "@/components/banner/partenariat";

interface Testimonial {
  id: number;
  client_name: string;
  testimonial_text: string;
  image_url?: string;
}

interface Partner {
  id: number;
  name: string;
  agency: string;
  image_url?: string;
  website_url?: string;
}

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [travelThemes, setTravelThemes] = useState<TravelTheme[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    // Charger les données depuis l'API
    const fetchData = async () => {
      try {
        const [destRes, typesRes, themesRes, testimonialsRes, partnersRes] =
          await Promise.all([
            api.get("/destinations?active=true&limit=5"),
            api.get("/travel-types?active=true"),
            api.get("/travel-themes?active=true&limit=20"),
            api.get(
              "/testimonials?featured=true&active=true&published=true&limit=6",
            ),
            api.get("/partners"),
          ]);

        const destData = destRes.data;
        const typesData = typesRes.data;
        const themesData = themesRes.data;
        const testimonialsData = testimonialsRes.data;
        const partnersData = partnersRes.data;

        if (destData.success) setDestinations(destData.data);
        if (typesData.success) setTravelTypes(typesData.data);
        if (themesData.success) setTravelThemes(themesData.data);
        if (testimonialsData.success) setTestimonials(testimonialsData.data);
        if (partnersData.success) setPartners(partnersData.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-y-10">
      {/* Hero animé */}
      <HeroAnimated />

      {/* Type de voyage Section - Intégration parfaite */}
      <TravelTypesHero />

      {/* Section Types de voyage */}
      <TravelTypesSection travelTypes={travelTypes} />

      {/* Destinations Section */}
      <DestinationsSection destinations={destinations} />

      {/* Thèmes Section */}
      <ThemesSection travelThemes={travelThemes} />

      {/* Section avec image background */}
      <div
        className="w-full h-auto p-3 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/Bannière - Partenariat Nuance du Monde x Espace Multisoleil/fond_Bannière.svg')",
        }}
      >
        <a href="https://www.espacemultisoleil.org">
        <div className="max-w-[1500px] mx-auto items-center py-5 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <Image 
            src="/Bannière - Partenariat Nuance du Monde x Espace Multisoleil/gauche.svg" 
            alt="Partenariat Nuance du Monde x Espace Multisoleil" 
            width={500}
            height={400}
            className="w-full h-auto object-contain"
          />
          <AnimatedBentoGrid />
        </div>
        </a>
      </div>

      {/* Témoignages Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Partenaires Section */}
      <PartnersSection partners={partners} />
      {/* Newsletter Section */}
      {/* <NewsletterForm /> */}
    </div>
  );
}
