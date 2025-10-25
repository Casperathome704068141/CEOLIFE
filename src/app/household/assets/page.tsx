
"use client";

import { AssetsTable } from "@/components/household/assets/AssetsTable";
import { HouseholdProvider } from "@/lib/household/useHousehold";

export default function AssetsPage() {
  return (
    <HouseholdProvider>
      <AssetsTable />
    </HouseholdProvider>
  );
}
