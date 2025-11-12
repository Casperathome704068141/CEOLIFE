'use client';

import { HouseholdProvider } from '@/lib/household/useHousehold';
import { AssetsTable } from '@/components/household/assets/AssetsTable';

export default function AssetsPage() {
  return (
    <HouseholdProvider>
      <AssetsTable />
    </HouseholdProvider>
  );
}
