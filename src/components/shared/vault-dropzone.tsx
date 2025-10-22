"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface VaultDropzoneProps {
  onFiles: (files: File[]) => void;
}

export function VaultDropzone({ onFiles }: VaultDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        onFiles(acceptedFiles);
      }
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
  });

  const rootProps = getRootProps();

  return (
    <motion.div
      {...(rootProps as Record<string, unknown>)}
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "flex h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-500/40 bg-slate-950/60 text-center text-slate-300 transition",
        isDragActive ? "border-cyan-400 bg-slate-900/80" : "",
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mb-2 h-8 w-8 text-cyan-300" />
      <p className="text-sm font-medium">Drop receipts or documents</p>
      <p className="text-xs text-slate-400">Beno will encrypt client-side and extract insights automatically.</p>
    </motion.div>
  );
}
