"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import type { AutoTagSuggestion, ScanResult } from "@/lib/vault/useVault";

interface ScanAutoTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (file: File) => Promise<ScanResult>;
  onSave: (payload: {
    file: File;
    extracted?: ScanResult["extracted"];
    suggestions?: AutoTagSuggestion;
    links?: ScanResult["links"];
  }) => Promise<void>;
}

export function ScanAutoTagDialog({ open, onOpenChange, onScan, onSave }: ScanAutoTagDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview(null);
      setResult(null);
      setIsScanning(false);
    }
  }, [open]);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setIsScanning(true);
    try {
      const scan = await onScan(selected);
      setResult(scan);
    } catch (error) {
      console.error(error);
      toast({ title: "Scan failed", description: "Unable to process the document." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = async () => {
    if (!file) return;
    await onSave({ file, extracted: result?.extracted, suggestions: result?.suggestions, links: result?.links });
    onOpenChange(false);
  };

  const detectedFields = useMemo(() => {
    if (!result?.extracted?.fields) return [];
    return Object.entries(result.extracted.fields);
  }, [result]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader>
          <DialogTitle>Scan & auto-tag</DialogTitle>
          <DialogDescription>Capture a receipt or document, run OCR, and let Beno suggest structure.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <label className="block rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 text-center">
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
              <div className="flex flex-col items-center gap-3 text-slate-300">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
                  {isScanning ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
                </span>
                <p className="text-sm font-medium">{file ? file.name : "Drop or capture a new document"}</p>
                <p className="text-xs text-slate-500">Supports live photos, screenshots, and PDFs.</p>
              </div>
            </label>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">Preview</h3>
              <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-950/60">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Document preview"
                    width={320}
                    height={240}
                    className="max-h-full rounded-2xl object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Sparkles className="h-6 w-6" />
                    <p className="text-xs">OCR results appear here after scanning.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <h3 className="text-sm font-semibold text-white">Extracted text</h3>
              <Textarea
                value={result?.extracted?.text ?? ""}
                onChange={(event) =>
                  setResult((prev) =>
                    prev
                      ? {
                          ...prev,
                          extracted: { ...prev.extracted, text: event.target.value },
                        }
                      : prev,
                  )
                }
                placeholder="OCR output will appear here"
                className="mt-2 h-40 rounded-2xl bg-slate-950/60"
              />
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Detected fields</h3>
                <Badge variant="outline" className="rounded-full border-cyan-500/60 text-cyan-200">
                  Suggestions
                </Badge>
              </div>
              <ScrollArea className="max-h-48 pr-4">
                {detectedFields.length === 0 ? (
                  <p className="text-xs text-slate-500">No structured fields detected yet.</p>
                ) : (
                  <div className="space-y-3">
                    {detectedFields.map(([key, value]) => (
                      <div key={key} className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-200">
                        <p className="font-semibold uppercase tracking-wide text-slate-400">{key}</p>
                        <Input
                          className="mt-1 h-9 rounded-xl bg-slate-900/60 text-sm"
                          value={String(value ?? "")}
                          onChange={(event) =>
                            setResult((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    extracted: {
                                      ...prev.extracted,
                                      fields: {
                                        ...prev.extracted?.fields,
                                        [key]: event.target.value,
                                      },
                                    },
                                  }
                                : prev,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            {result?.suggestions ? (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
                <h3 className="text-sm font-semibold text-white">Suggested classification</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                  {result.suggestions.type ? (
                    <Badge className="rounded-full bg-cyan-500/20 text-cyan-200">
                      Type: {result.suggestions.type}
                    </Badge>
                  ) : null}
                  {result.suggestions.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full border-cyan-500/60 text-cyan-200">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
            disabled={!file || isScanning}
          >
            Save as document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
