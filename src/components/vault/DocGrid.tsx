"use client";

import { Fragment } from "react";
import { DocCard } from "./DocCard";
import type { VaultDocument } from "@/lib/vault/useVault";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface DocGridProps {
  docs: VaultDocument[];
  viewMode: "grid" | "list";
  bulkMode?: boolean;
  selectedIds: string[];
  isLoading?: boolean;
  onToggleSelect: (id: string) => void;
  onOpen: (doc: VaultDocument) => void;
  onRename: (doc: VaultDocument) => void;
  onTags: (doc: VaultDocument, tag: string) => void;
  onSetExpiry: (doc: VaultDocument) => void;
  onLink: (doc: VaultDocument) => void;
  onShare: (doc: VaultDocument) => void;
  onMove: (doc: VaultDocument) => void;
  onDelete: (ids: string[]) => void;
  onDownload: (doc: VaultDocument, mode: "encrypted" | "decrypted") => void;
}

export function DocGrid({
  docs,
  viewMode,
  bulkMode,
  selectedIds,
  isLoading,
  onToggleSelect,
  onOpen,
  onRename,
  onTags,
  onSetExpiry,
  onLink,
  onShare,
  onMove,
  onDelete,
  onDownload,
}: DocGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-3xl bg-slate-900/60" />
        ))}
      </div>
    );
  }

  if (!docs.length) {
    return (
      <motion.div
        className="rounded-3xl border border-dashed border-slate-800/70 bg-slate-950/60 p-12 text-center text-slate-400"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-lg font-medium text-slate-200">No documents match your filters.</p>
        <p className="text-sm text-slate-400">Upload a file or adjust filters to see items in your vault.</p>
      </motion.div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {docs.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            viewMode={viewMode}
            bulkMode={bulkMode}
            selected={selectedIds.includes(doc.id)}
            onToggleSelect={onToggleSelect}
            onOpen={onOpen}
            onRename={onRename}
            onTags={onTags}
            onSetExpiry={onSetExpiry}
            onLink={onLink}
            onShare={onShare}
            onMove={onMove}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {docs.map((doc) => (
        <Fragment key={doc.id}>
          <DocCard
            doc={doc}
            viewMode={viewMode}
            bulkMode={bulkMode}
            selected={selectedIds.includes(doc.id)}
            onToggleSelect={onToggleSelect}
            onOpen={onOpen}
            onRename={onRename}
            onTags={onTags}
            onSetExpiry={onSetExpiry}
            onLink={onLink}
            onShare={onShare}
            onMove={onMove}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        </Fragment>
      ))}
    </div>
  );
}
