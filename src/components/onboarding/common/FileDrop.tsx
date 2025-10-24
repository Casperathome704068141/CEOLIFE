"use client";

import { ChangeEvent, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileDropProps {
  onFiles: (files: File[]) => void;
}

export function FileDrop({ onFiles }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    onFiles(Array.from(files));
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex h-32 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/60 text-sm text-muted-foreground transition hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-200"
      )}
    >
      <input ref={inputRef} type="file" className="hidden" multiple onChange={handleFiles} />
      <p>Click to browse receipts or IDs</p>
    </button>
  );
}
