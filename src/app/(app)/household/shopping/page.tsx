'use client';

import { HouseholdProvider } from '@/lib/household/useHousehold';
import { ShoppingList } from '@/components/household/shopping/ShoppingList';

export default function ShoppingPage() {
  return (
    <HouseholdProvider>
      <ShoppingList />
    </HouseholdProvider>
  );
}
