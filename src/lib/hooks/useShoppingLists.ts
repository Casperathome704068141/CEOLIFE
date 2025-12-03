"use client";

import { useCollection, useUser } from "@/firebase";
import { ShoppingListDoc } from "../schemas";

export function useShoppingLists() {
  const { user } = useUser();

  return useCollection<ShoppingListDoc>("shoppingLists", {
    query: ["ownerId", "==", user?.uid],
    skip: !user?.uid,
  });
}
