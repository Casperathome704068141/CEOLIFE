"use client";

import { useCollection, useUser } from "@/firebase";
import { DocumentDoc } from "../schemas";

export function useDocuments() {
  const { user } = useUser();

  return useCollection<DocumentDoc>("documents", {
    query: ["ownerId", "==", user?.uid],
    skip: !user?.uid,
  });
}
