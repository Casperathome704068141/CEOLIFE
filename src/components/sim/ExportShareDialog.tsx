"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scenario, SimResult } from "@/lib/sim/types";
import { FileDown, FileSpreadsheet, Image, Share2 } from "lucide-react";

interface ExportShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario?: Scenario | null;
  result?: SimResult;
  onExport: (format: "pdf" | "csv" | "png") => void;
  onShare: () => void;
}

export function ExportShareDialog({ open, onOpenChange, scenario, result, onExport, onShare }: ExportShareDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-slate-900/80 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Share scenario</DialogTitle>
          <DialogDescription>
            Export KPI snapshots and timelines or send a quick summary via WhatsApp without leaving Beno.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">{scenario?.name ?? "Untitled scenario"}</p>
            <p>Runway {result?.runwayMonths ?? "—"} months · Risk {result?.riskScore ?? "—"}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => onExport("pdf")}
              className="flex items-center justify-start gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
            >
              <FileDown className="h-4 w-4" /> Export PDF snapshot
            </Button>
            <Button
              onClick={() => onExport("csv")}
              className="flex items-center justify-start gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export monthly CSV
            </Button>
            <Button
              onClick={() => onExport("png")}
              className="flex items-center justify-start gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
            >
              <Image className="h-4 w-4" /> Export timeline PNG
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={onShare}
            className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
          >
            <Share2 className="h-4 w-4" /> Share via WhatsApp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
