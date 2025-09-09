"use client";

import { useState, useEffect } from "react";
import { Destination, TravelType, TravelTheme } from "@/types";
import HeroAnimated from "@/components/HeroAnimated";
import TravelTypesHero from "@/components/TravelTypesHero";
import TravelTypesSection from "@/components/TravelTypesSection";
import DestinationsSection from "@/components/DestinationsSection";
import ThemesSection from "@/components/ThemesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection";
import Image from "next/image";

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
            fetch("/api/destinations?active=true&limit=20"),
            fetch("/api/travel-types?active=true"),
            fetch("/api/travel-themes?active=true&limit=20"),
            fetch(
              "/api/testimonials?featured=true&active=true&published=true&limit=6"
            ),
            fetch("/api/partners"),
          ]);

        const [
          destData,
          typesData,
          themesData,
          testimonialsData,
          partnersData,
        ] = await Promise.all([
          destRes.json(),
          typesRes.json(),
          themesRes.json(),
          testimonialsRes.json(),
          partnersRes.json(),
        ]);

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

      {/* Témoignages Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Partenaires Section */}
      <PartnersSection partners={partners} />
      {/* Newsletter Section */}
      {/* <NewsletterForm /> */}
    </div>
  );
}
