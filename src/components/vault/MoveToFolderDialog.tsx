"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VaultDocument } from "@/lib/vault/useVault";

interface MoveToFolderDialogProps {
  context: { ids: string[]; doc?: VaultDocument } | null;
  onClose: () => void;
  onMove: (ids: string[], folder: string) => Promise<void> | void;
}

export function MoveToFolderDialog({ context, onClose, onMove }: MoveToFolderDialogProps) {
  const [folder, setFolder] = useState("");

  useEffect(() => {
    if (!context) {
      setFolder("");
    }
  }, [context]);

  if (!context) return null;

  const handleSave = () => {
    if (!folder.trim()) return;
    onMove(context.ids, folder.trim());
    onClose();
  };

  return (
    <Dialog open={Boolean(context)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Move to folder</DialogTitle>
          <DialogDescription>
            Create lightweight folders to group documents without leaving the vault.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={folder}
            onChange={(event) => setFolder(event.target.value)}
            placeholder="e.g. Taxes 2024"
            className="h-10 rounded-2xl bg-slate-900/60"
          />
          <p className="text-xs text-slate-500">Applies to {context.ids.length} document(s).</p>
        </div>
        <DialogFooter className="flex items-center justify-end gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white" onClick={handleSave}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
