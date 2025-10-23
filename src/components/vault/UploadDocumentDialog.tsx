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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileIcon, Loader2 } from "lucide-react";
import { VaultDropzone } from "./VaultDropzone";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => Promise<void>;
}

export function UploadDocumentDialog({ open, onOpenChange, onUpload }: UploadDocumentDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setProgress(0);
      setIsUploading(false);
    }
  }, [open]);

  const handleUpload = async () => {
    if (!files.length) return;
    setIsUploading(true);
    setProgress(12);
    try {
      await onUpload(files);
      setProgress(100);
      setTimeout(() => {
        onOpenChange(false);
      }, 350);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Upload encrypted documents</DialogTitle>
          <DialogDescription>
            Files are encrypted locally with AES-GCM before leaving your device. We never receive plaintext copies.
          </DialogDescription>
        </DialogHeader>

        <VaultDropzone
          onFiles={(dropped) => setFiles((prev) => [...prev, ...dropped])}
          disabled={isUploading}
        />

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Selected files</span>
            <span>{files.length} total</span>
          </div>
          <ScrollArea className="mt-3 max-h-56">
            <div className="space-y-2">
              {files.length === 0 ? (
                <p className="text-xs text-slate-500">No files yet. Drag & drop receipts, bills, or PDFs.</p>
              ) : (
                files.map((file) => (
                  <div
                    key={`${file.name}-${file.lastModified}`}
                    className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                        <FileIcon className="h-4 w-4" />
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="rounded-full border-cyan-500/60 text-cyan-200">
                      AES-GCM
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {isUploading ? (
          <div className="space-y-2">
            <Progress value={progress} className="h-2 rounded-full bg-slate-800" />
            <p className="text-xs text-slate-400">Encrypting and uploading…</p>
          </div>
        ) : null}

        <DialogFooter className="flex items-center justify-between gap-2 sm:flex-row">
          <Button variant="ghost" className="rounded-2xl" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading
              </span>
            ) : (
              "Encrypt & upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
