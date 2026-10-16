import TravelTypes from "@/components/travel/TravelTypes";
import { TravelType } from "@/types";

interface TravelTypesSectionProps {
  travelTypes: TravelType[];
  onShowAuthModal?: () => void;
  gridLimit?: number;
}

export default function TravelTypesSection({ travelTypes, onShowAuthModal, gridLimit }: TravelTypesSectionProps) {
  return (
    <section className=" bg-gray-50">
      <div className={gridLimit !== undefined ? "mx-auto px-4" : "container mx-auto px-4"}>
        {/* Travel Types Component */}
        {travelTypes.length > 0 &&
          <TravelTypes travelTypes={travelTypes} onShowAuthModal={onShowAuthModal} gridLimit={gridLimit} />
        }
      </div>
    </section>
  );
}
