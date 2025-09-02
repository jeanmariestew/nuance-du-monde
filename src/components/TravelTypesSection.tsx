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
        {travelTypes.length > 0 ? (
          <TravelTypes travelTypes={travelTypes} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        )}
      </div>
    </section>
  );
}
