
"use client";

import { ShoppingList } from "@/components/household/shopping/ShoppingList";
import { HouseholdProvider } from "@/lib/household/useHousehold";

export default function ShoppingPage() {
  return (
    <HouseholdProvider>
      <ShoppingList />
    </HouseholdProvider>
  );
}
