"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const typeOptions = [
  "id",
  "bill",
  "receipt",
  "medical",
  "insurance",
  "contract",
  "education",
  "vehicle",
  "housing",
  "other",
];

const sourceOptions = ["upload", "scan", "email"];

export interface VaultFilters {
  types?: string[];
  tags?: string[];
  expiry?: "active" | "90" | "expired";
  linkedStatus?: "linked" | "unlinked";
  source?: string[];
}

interface FiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: VaultFilters;
  onApply: (filters: VaultFilters) => void;
}

export function FiltersDrawer({ open, onOpenChange, filters, onApply }: FiltersDrawerProps) {
  const [local, setLocal] = useState<VaultFilters>({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (open) {
      setLocal(filters);
      setTagInput("");
    }
  }, [open, filters]);

  const toggleValue = (key: keyof VaultFilters, value: string) => {
    setLocal((prev) => {
      const list = new Set(prev[key] as string[] | undefined);
      if (list.has(value)) {
        list.delete(value);
      } else {
        list.add(value);
      }
      return { ...prev, [key]: Array.from(list) };
    });
  };

  const apply = () => {
    onApply(local);
    onOpenChange(false);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setLocal((prev) => ({
      ...prev,
      tags: Array.from(new Set([...(prev.tags ?? []), tagInput.trim().toLowerCase()])),
    }));
    setTagInput("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-6 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the documents shown in this workspace.</SheetDescription>
        </SheetHeader>
        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Types</h3>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <Button
                  key={type}
                  variant={local.types?.includes(type) ? "default" : "secondary"}
                  className="rounded-full"
                  onClick={() => toggleValue("types", type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Tags</h3>
            <div className="flex items-center gap-2">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                placeholder="Add tag"
                className="h-9 rounded-2xl bg-slate-900/60"
              />
              <Button className="rounded-2xl" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {local.tags?.map((tag) => (
                <Badge key={tag} className="rounded-full bg-cyan-500/20 text-cyan-200">
                  #{tag}
                </Badge>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Expiry</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Active", value: "active" },
                { label: "Expiring 90d", value: "90" },
                { label: "Expired", value: "expired" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={local.expiry === option.value ? "default" : "secondary"}
                  className="rounded-full"
                  onClick={() => setLocal((prev) => ({ ...prev, expiry: option.value as VaultFilters["expiry"] }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Linked status</h3>
            <div className="flex gap-2">
              <Button
                variant={local.linkedStatus === "linked" ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => setLocal((prev) => ({ ...prev, linkedStatus: "linked" }))}
              >
                Linked
              </Button>
              <Button
                variant={local.linkedStatus === "unlinked" ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => setLocal((prev) => ({ ...prev, linkedStatus: "unlinked" }))}
              >
                Unlinked
              </Button>
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Source</h3>
            <div className="flex flex-wrap gap-2">
              {sourceOptions.map((source) => (
                <Button
                  key={source}
                  variant={local.source?.includes(source) ? "default" : "secondary"}
                  className="rounded-full"
                  onClick={() => toggleValue("source", source)}
                >
                  {source}
                </Button>
              ))}
            </div>
          </section>
        </div>
        <SheetFooter className="mt-auto flex gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={() => onApply({})}>
            Reset
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white" onClick={apply}>
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
