
"use client";

import { SharedLedger } from "@/components/household/split/SharedLedger";
import { HouseholdProvider } from "@/lib/household/useHousehold";

export default function SplitPage() {
  return (
    <HouseholdProvider>
      <SharedLedger />
    </HouseholdProvider>
  );
}
