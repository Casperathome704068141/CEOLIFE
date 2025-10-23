"use client";

import { useCallback, useMemo, useState } from "react";
import { useUser, useFirestore, useFirebaseApp, useCollection } from "@/firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc as firestoreDoc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { format } from "date-fns";
import { encryptFile, exportVaultKey, generateVaultKey, importVaultKey } from "./crypto";
import type { VaultFilters } from "@/components/vault/FiltersDrawer";
import { toast } from "@/hooks/use-toast";

export interface ShareEntry {
  id: string;
  role: "viewer" | "editor" | "emergency";
  expiresAt?: string;
}

export interface AutoTagSuggestion {
  type?: string;
  tags?: string[];
  links?: VaultDocument["links"];
}

export interface ShareAclPayload {
  people: ShareEntry[];
  maskSensitive: boolean;
  window?: { start?: string; end?: string };
}

export interface ScanResult {
  extracted?: {
    text?: string;
    fields?: Record<string, unknown>;
  };
  suggestions?: AutoTagSuggestion;
  links?: VaultDocument["links"];
}

export interface VaultDocument {
  id: string;
  filename: string;
  type?: string;
  size?: number;
  checksum?: string;
  encrypted: boolean;
  tags: string[];
  expireDate?: string | Date | Timestamp | null;
  shareACL?: ShareEntry[];
  links?: {
    billId?: string;
    txnId?: string;
    eventId?: string;
    medId?: string;
  };
  extracted?: {
    text?: string;
    fields?: Record<string, unknown>;
  };
  ocrStatus?: "queued" | "done" | "error";
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
  createdAtFormatted?: string;
  updatedAtFormatted?: string;
  expireDateFormatted?: string;
  ownerId: string;
  source?: "upload" | "scan" | "email";
  folder?: string;
}

interface UploadOptions {
  extracted?: ScanResult["extracted"];
  suggestions?: AutoTagSuggestion;
  links?: VaultDocument["links"];
  source?: VaultDocument["source"];
}

const STORAGE_ROOT = "vault";
const KEY_STORAGE_KEY = "ceolife-vault-key";

export function useVault() {
  const { user } = useUser();
  const firestore = useFirestore();
  const app = useFirebaseApp();
  const [filters, setFilters] = useState<VaultFilters>({});
  const [search, setSearch] = useState("");

  const { data = [], loading } = useCollection<VaultDocument>("documents", {
    query: ["ownerId", "==", user?.uid],
    skip: !user?.uid,
  });

  const docs = useMemo(() => data.map((doc) => enrichDoc(doc)), [data]);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchesSearch = q
        ? doc.filename.toLowerCase().includes(q) ||
          doc.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          (doc.extracted?.text ?? "").toLowerCase().includes(q)
        : true;

      const matchesTypes = filters.types?.length ? filters.types.includes((doc.type ?? "other").toLowerCase()) : true;
      const matchesTags = filters.tags?.length
        ? filters.tags.every((tag) => doc.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
        : true;
      const matchesSource = filters.source?.length ? filters.source.includes(doc.source ?? "upload") : true;

      let matchesExpiry = true;
      if (filters.expiry) {
        const date = extractDate(doc.expireDate);
        if (!date) {
          matchesExpiry = filters.expiry === "active";
        } else {
          const now = new Date();
          const diff = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
          if (filters.expiry === "expired") matchesExpiry = diff < 0;
          if (filters.expiry === "90") matchesExpiry = diff <= 90 && diff >= 0;
          if (filters.expiry === "active") matchesExpiry = diff > 90 || diff >= 0;
        }
      }

      let matchesLinked = true;
      if (filters.linkedStatus) {
        const hasLinks = Boolean(doc.links?.billId || doc.links?.txnId || doc.links?.eventId || doc.links?.medId);
        matchesLinked = filters.linkedStatus === "linked" ? hasLinks : !hasLinks;
      }

      return matchesSearch && matchesTypes && matchesTags && matchesSource && matchesExpiry && matchesLinked;
    });
  }, [docs, filters, search]);

  const getEncryptionKey = useCallback(async () => {
    if (typeof window === "undefined") throw new Error("Encryption key requires browser context");
    const cached = window.localStorage.getItem(KEY_STORAGE_KEY);
    if (cached) {
      return importVaultKey(cached);
    }
    const key = await generateVaultKey();
    const serialized = await exportVaultKey(key);
    window.localStorage.setItem(KEY_STORAGE_KEY, serialized);
    return key;
  }, []);

  const upload = useCallback(
    async (files: File[], options?: UploadOptions) => {
      if (!user?.uid || !firestore || !app) {
        toast({ title: "Not ready", description: "Sign in to upload documents." });
        return;
      }
      const storage = getStorage(app);
      const key = await getEncryptionKey();

      for (const file of files) {
        const encrypted = await encryptFile(file, key);
        const storageRef = ref(storage, `${STORAGE_ROOT}/${user.uid}/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, new Uint8Array(encrypted.cipher));
        await addDoc(collection(firestore, "documents"), {
          filename: file.name,
          type: options?.suggestions?.type ?? "other",
          size: file.size,
          checksum: encrypted.checksum,
          encrypted: true,
          tags: options?.suggestions?.tags ?? [],
          expireDate: null,
          shareACL: [],
          links: options?.links ?? {},
          extracted: options?.extracted ?? null,
          ocrStatus: options?.extracted ? "done" : "queued",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ownerId: user.uid,
          source: options?.source ?? "upload",
        });
      }
    },
    [app, firestore, getEncryptionKey, user?.uid],
  );

  const scanAndAutoTag = useCallback(async (file: File): Promise<ScanResult> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/vault/ocr", { method: "POST", body: formData });
    if (!response.ok) {
      throw new Error("OCR failed");
    }
    const data = (await response.json()) as ScanResult;
    return data;
  }, []);

  const updateDocPartial = useCallback(
    async (id: string, payload: Partial<VaultDocument>) => {
      if (!firestore) return;
      await updateDoc(firestoreDoc(firestore, "documents", id), {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    },
    [firestore],
  );

  const deleteDoc = useCallback(
    async (ids: string[]) => {
      if (!firestore) return;
      const batch = writeBatch(firestore);
      ids.forEach((id) => {
        batch.update(firestoreDoc(firestore, "documents", id), {
          deletedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      toast({ title: "Documents moved to trash", description: "Undo via history within 7 days." });
    },
    [firestore],
  );

  const linkEntities = useCallback(
    async (id: string, links: VaultDocument["links"]) => {
      await updateDocPartial(id, { links });
    },
    [updateDocPartial],
  );

  const setExpiry = useCallback(
    async (id: string, payload: { expireDate: Date | null; reminders: number[] }) => {
      await updateDocPartial(id, {
        expireDate: payload.expireDate ? payload.expireDate.toISOString() : null,
        reminderOffsets: payload.reminders,
      } as any);
    },
    [updateDocPartial],
  );

  const shareAcl = useCallback(
    async (ids: string[], payload: ShareAclPayload) => {
      if (!firestore) return;
      const batch = writeBatch(firestore);
      ids.forEach((id) => {
        batch.update(firestoreDoc(firestore, "documents", id), {
          shareACL: payload.people,
          shareMask: payload.maskSensitive,
          shareWindow: payload.window ?? null,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      toast({ title: "Sharing updated", description: "Recipients will receive secure notifications." });
    },
    [firestore],
  );

  const moveToFolder = useCallback(
    async (ids: string[], folder: string) => {
      if (!firestore) return;
      const batch = writeBatch(firestore);
      ids.forEach((id) => {
        batch.update(firestoreDoc(firestore, "documents", id), {
          folder,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      toast({ title: "Moved", description: `Moved ${ids.length} item(s) to ${folder}.` });
    },
    [firestore],
  );

  const toggleTag = useCallback(
    async (id: string, tag: string) => {
      const doc = docs.find((item) => item.id === id);
      if (!doc) return;
      const exists = doc.tags?.includes(tag);
      const tags = exists ? doc.tags.filter((item) => item !== tag) : [...(doc.tags ?? []), tag];
      await updateDocPartial(id, { tags });
    },
    [docs, updateDocPartial],
  );

  const refresh = useCallback(() => {
    toast({ title: "Refreshed", description: "Listening for live updates." });
  }, []);

  return {
    docs,
    filteredDocs,
    isLoading: loading,
    filters,
    setFilters,
    search,
    setSearch,
    upload,
    scanAndAutoTag,
    updateDoc: updateDocPartial,
    deleteDoc,
    linkEntities,
    setExpiry,
    shareAcl,
    moveToFolder,
    toggleTag,
    refresh,
  };
}

function extractDate(value?: string | Date | Timestamp | null) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  if (value instanceof Timestamp) return value.toDate();
  if (typeof (value as any).toDate === "function") return (value as any).toDate();
  return null;
}

function enrichDoc(doc: VaultDocument): VaultDocument {
  const created = extractDate(doc.createdAt);
  const updated = extractDate(doc.updatedAt);
  const expiry = extractDate(doc.expireDate as any);
  return {
    ...doc,
    createdAtFormatted: created ? format(created, "MMM d, yyyy") : "Just now",
    updatedAtFormatted: updated ? format(updated, "MMM d, yyyy") : "Just now",
    expireDateFormatted: expiry ? format(expiry, "MMM d, yyyy") : undefined,
  };
}
