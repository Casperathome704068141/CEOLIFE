"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

interface VaultDropzoneProps {
  onFiles?: (files: File[]) => void | Promise<void>;
  disabled?: boolean;
}

export function VaultDropzone({ onFiles, disabled }: VaultDropzoneProps) {
  const handleDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length || disabled) return;
      void onFiles?.(accepted);
    },
    [disabled, onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    disabled,
  });

  return (
    <motion.div
      {...getRootProps({
        className: cn(
          "relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-cyan-500/40 bg-slate-950/60 text-center transition",
          disabled ? "cursor-not-allowed opacity-60" : "hover:border-cyan-400 hover:bg-slate-900/40",
          isDragActive ? "border-cyan-400 bg-slate-900/30" : undefined,
        ),
      })}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      role="button"
      aria-label="Drop receipts or documents"
      tabIndex={0}
    >
      <input {...getInputProps()} aria-hidden />
      <div className="flex flex-col items-center gap-4 px-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
          <UploadCloud className="h-8 w-8" />
        </span>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-white">
            Drop receipts or documents — encrypted client-side
          </p>
          <p className="text-sm text-slate-400">
            Beno extracts insights automatically with on-device encryption and background OCR.
          </p>
        </div>
        <span className="rounded-full bg-slate-900/70 px-4 py-1 text-xs uppercase tracking-wide text-slate-300">
          {isDragActive ? "Release to upload" : "Click to browse"}
        </span>
      </div>
    </motion.div>
  );
}
