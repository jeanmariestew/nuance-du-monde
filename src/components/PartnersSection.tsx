import Image from "next/image";
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
    <section className="bg-gray-100 relative">
      <Image
        src="/images/fond_partenaire.jpg"
        alt="Background themes"
        fill
        className="object-cover"
      />
      <div className="w-full px-4  py-10 text-center relative z-10 bg-white/80">
        <h2 className="text-3xl font-bold mb-6 text-[#d9a900] font-[Alro] uppercase tracking-wide">
          NOS PARTENAIRES AGENCES DE VOYAGE
        </h2>
        <p className="text-sm text-gray-700 max-w-lg mx-auto mb-12 leading-relaxed">
          Nuance du Monde collabore avec des agences de voyage dévouées qui se
          distinguent par leur engagement envers l&apos;excellence. Ensemble,
          nous créons des expériences de voyage à la carte et riches, alliant
          passion et expertise pour offrir à nos clients des aventures uniques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto">
          {partners.map((partner) => (
            <Link
              key={partner.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              href={partner.website_url || ""}
            >
              <div className="p-1">
                <div className="relative w-full h-36 mx-auto mb-4">
                  {partner.image_url ? (
                    <Image
                      src={partner.image_url}
                      alt={partner.name}
                      fill
                      className="rounded-2xl object-cover"
                    />
                  ) : (
                    <Image
                      src={"/images/unnamed.png"}
                      alt={partner.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <h4 className="font-bold text-lg text-yellow-600 mb-1">
                  {partner.name}
                </h4>
                <p className="text-sm text-gray-600 font-medium">
                  {partner.agency}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
