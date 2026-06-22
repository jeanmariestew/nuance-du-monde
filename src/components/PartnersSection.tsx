import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";

interface Partner {
  id: number;
  name: string;
  agency: string;
  image_url?: string;
  website_url?: string;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  return (
    <section className="bg-linear-to-br from-yellow-50 via-orange-50 to-yellow-100 relative overflow-hidden py-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full px-4 text-center relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#d9a900] font-[Alro] uppercase tracking-wide drop-shadow-sm">
            NOS PARTENAIRES AGENCES DE VOYAGE
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Nuance du Monde collabore avec des agences de voyage dévouées qui se
            distinguent par leur engagement envers l&apos;excellence. Ensemble,
            nous créons des expériences de voyage à la carte et riches, alliant
            passion et expertise pour offrir à nos clients des aventures uniques.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 border-2 border-yellow-200/50"
              //href={partner.website_url || "#"}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-yellow-400/0 to-orange-500/0 group-hover:from-yellow-400/10 group-hover:to-orange-500/10 rounded-3xl transition-all duration-500"></div>
              
              <div className="relative">
                {/* Logo Container */}
                <div className="flex items-center justify-center mb-6 min-h-[100px]">
                  {partner.image_url ? (
                    <div className="relative w-full h-auto flex items-center justify-center">
                      <OptimizedImage
                        src={partner.image_url}
                        alt={partner.name}
                        width={180}
                        height={70}
                        className="w-auto h-auto max-w-[180px] max-h-[70px] object-contain transition-all duration-500 group-hover:scale-110"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-linear-to-br from-yellow-100 to-orange-200 rounded-2xl flex items-center justify-center">
                      <span className="text-4xl">✈️</span>
                    </div>
                  )}
                </div>

                {/* Partner Info */}
                <div className="space-y-2 pt-4 border-t-2 border-yellow-100">
                  <h4 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                    {partner.name}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    {partner.agency}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
