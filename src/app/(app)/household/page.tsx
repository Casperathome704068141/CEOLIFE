'use client';

import { HouseholdProvider } from '@/lib/household/useHousehold';
import { MembersGrid } from '@/components/household/MembersGrid';

export default function HouseholdPage() {
  return (
    <HouseholdProvider>
      <MembersGrid />
    </HouseholdProvider>
  );
}
