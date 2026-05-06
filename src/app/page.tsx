"use client";

import { useState, useEffect } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { Destination, TravelType, TravelTheme } from "@/types";
import HeroAnimated from "@/components/HeroAnimated";
import TravelTypesHero from "@/components/TravelTypesHero";
import TravelTypesSection from "@/components/TravelTypesSection";
import DestinationsSection from "@/components/DestinationsSection";
import ThemesSection from "@/components/ThemesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection";
import BtoBtoCSection from "@/components/BtoBtoCSection";
import { api } from "@/lib/axios";
import AnimatedBentoGrid from "@/components/banner/partenariat";
import { useProfessional } from "@/contexts/ProfessionalContext";

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
  const [proVideoUrl, setProVideoUrl] = useState('');
  const [particulierVideoUrl, setParticulierVideoUrl] = useState('');
  const { session } = useProfessional();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesUrl = session?.isAuthenticated
          ? "/travel-types?active=true&includePro=true"
          : "/travel-types?active=true";

        const [destRes, typesRes, themesRes, testimonialsRes, partnersRes, settingsRes] =
          await Promise.all([
            api.get("/destinations?active=true&limit=5"),
            api.get(typesUrl),
            api.get("/travel-themes?active=true&limit=20"),
            api.get("/testimonials?featured=true&active=true&published=true&limit=6"),
            api.get("/partners"),
            fetch("/api/settings").then(r => r.json()).catch(() => ({ success: false })),
          ]);

        if (destRes.data.success) setDestinations(destRes.data.data);
        if (typesRes.data.success) setTravelTypes(typesRes.data.data);
        if (themesRes.data.success) setTravelThemes(themesRes.data.data);
        if (testimonialsRes.data.success) setTestimonials(testimonialsRes.data.data);
        if (partnersRes.data.success) setPartners(partnersRes.data.data);
        if (settingsRes.success) {
          setProVideoUrl(settingsRes.data?.pro_video_url || '');
          setParticulierVideoUrl(settingsRes.data?.particulier_video_url || '');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, [session?.isAuthenticated]);

  return (
    <div className="flex flex-col gap-y-10">
      {/* Hero animé */}
      <HeroAnimated />

      {/* Type de voyage Section */}
      <TravelTypesHero />

      {/* Section Types de voyage */}
      <TravelTypesSection travelTypes={travelTypes} />

      {/* Destinations Section */}
      <DestinationsSection destinations={destinations} />

      {/* Thèmes Section */}
      <ThemesSection travelThemes={travelThemes} />

      {/* Section B2B / B2C */}
      {/* <BtoBtoCSection
        proVideoUrl={proVideoUrl}
        particulierVideoUrl={particulierVideoUrl}
      /> */}

      {/* Bannière Partenariat Multisoleil */}
      <div
        className="w-full h-auto p-3 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/fond_Banniere.svg')" }}
      >
        <a href="https://www.espacemultisoleil.org">
          <div className="max-w-[1500px] mx-auto items-center py-5 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <OptimizedImage
              src="/images/gauche.svg"
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
    </div>
  );
}
