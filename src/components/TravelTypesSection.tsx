import TravelTypes from "@/components/travel/TravelTypes";
import { TravelType } from "@/types";

interface TravelTypesSectionProps {
  travelTypes: TravelType[];
}

export default function TravelTypesSection({ travelTypes }: TravelTypesSectionProps) {
  return (
    <section className=" bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Travel Types Component */}
        {travelTypes.length > 0 &&
          <TravelTypes travelTypes={travelTypes} />
        }
      </div>
    </section>
  );
}
