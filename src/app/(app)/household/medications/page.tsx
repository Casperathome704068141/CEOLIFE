'use client';

import { HouseholdProvider } from '@/lib/household/useHousehold';
import { CareProfiles } from '@/components/household/care/CareProfiles';

export default function MedicationsPage() {
  return (
    <HouseholdProvider>
      <CareProfiles />
    </HouseholdProvider>
  );
}
