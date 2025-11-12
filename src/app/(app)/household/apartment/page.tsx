'use client';

import { HouseholdProvider } from '@/lib/household/useHousehold';
import { ApartmentOverview } from '@/components/household/apartment/ApartmentOverview';

export default function ApartmentPage() {
  return (
    <HouseholdProvider>
      <ApartmentOverview />
    </HouseholdProvider>
  );
}
