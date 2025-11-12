'use client';

import { HouseholdProvider } from '@/lib/household/useHousehold';
import { SharedLedger } from '@/components/household/split/SharedLedger';

export default function SplitPage() {
  return (
    <HouseholdProvider>
      <SharedLedger />
    </HouseholdProvider>
  );
}
