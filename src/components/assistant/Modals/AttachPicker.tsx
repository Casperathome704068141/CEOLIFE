"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, ImageIcon } from "lucide-react";

const OPTIONS = [
  { icon: UploadCloud, label: "Upload file", description: "PDF, CSV, image" },
  { icon: FileText, label: "Fetch from Vault", description: "Contracts, policies" },
  { icon: ImageIcon, label: "Scan receipt", description: "Open camera" },
];

export function AttachPicker({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (label: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-slate-800 bg-slate-950/90">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Attach</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {OPTIONS.map(({ icon: Icon, label, description }) => (
            <Button
              key={label}
              variant="ghost"
              className="flex h-auto flex-col items-start gap-1 rounded-2xl border border-slate-800/60 bg-slate-900/40 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-900/70"
              onClick={() => onSelect?.(label)}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </div>
              <span className="text-xs text-slate-400">{description}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
