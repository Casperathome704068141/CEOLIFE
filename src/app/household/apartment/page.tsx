
"use client";

import { ApartmentOverview } from "@/components/household/apartment/ApartmentOverview";
import { HouseholdProvider } from "@/lib/household/useHousehold";

export default function ApartmentPage() {
  return (
    <HouseholdProvider>
      <ApartmentOverview />
    </HouseholdProvider>
  );
}
