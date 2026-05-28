import TravelTypes from "@/components/travel/TravelTypes";
import { TravelType } from "@/types";

interface TravelTypesSectionProps {
  travelTypes: TravelType[];
  onShowAuthModal?: () => void;
}

export default function TravelTypesSection({ travelTypes, onShowAuthModal }: TravelTypesSectionProps) {
  return (
    <section className=" bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Travel Types Component */}
        {travelTypes.length > 0 &&
          <TravelTypes travelTypes={travelTypes} onShowAuthModal={onShowAuthModal} />
        }
      </div>
    </section>
  );
}
