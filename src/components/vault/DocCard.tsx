"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { VaultDocument } from "@/lib/vault/useVault";
import { CalendarClock, Edit3, ExternalLink, Link2, MoreHorizontal, Share2, Tags, Trash2 } from "lucide-react";
import * as Lucide from "lucide-react";
import { Input } from "@/components/ui/input";

const typeIcons: Record<string, Lucide.LucideIcon> = {
  bill: Lucide.Receipt,
  receipt: Lucide.Receipt,
  medical: Lucide.Stethoscope,
  contract: Lucide.FileSignature,
  insurance: Lucide.ShieldCheck,
  id: Lucide.IdCard,
  education: Lucide.GraduationCap,
  vehicle: Lucide.Car,
  housing: Lucide.Home,
  other: Lucide.FileText,
};

interface DocCardProps {
  doc: VaultDocument;
  viewMode: "grid" | "list";
  bulkMode?: boolean;
  selected?: boolean;
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

export function DocCard({
  doc,
  viewMode,
  bulkMode,
  selected,
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
}: DocCardProps) {
  const Icon = typeIcons[doc.type ?? ""] ?? Lucide.FileText;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(doc.filename);

  const handleRename = () => {
    if (!name.trim()) return;
    onRename({ ...doc, filename: name.trim() });
    setIsEditing(false);
  };

  const layoutClass = viewMode === "grid" ? "flex-col items-start" : "flex-row items-center";

  const content = (
    <Card
      className={cn(
        "group relative flex h-full w-full gap-3 rounded-3xl border border-slate-900/60 bg-slate-950/70 p-4 transition",
        selected ? "border-cyan-500/60 bg-slate-900/70" : "hover:border-cyan-500/40",
      )}
      role="article"
      aria-label={`${doc.filename} document`}
    >
      <div className="flex w-full gap-4">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
            <Icon className="h-6 w-6" />
          </span>
          {bulkMode ? (
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect(doc.id)}
              aria-label={`Select ${doc.filename}`}
            />
          ) : null}
        </div>
        <div className={cn("flex flex-1", layoutClass, viewMode === "list" ? "gap-4" : "gap-3")}> 
          <div className="flex-1 space-y-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleRename();
                    if (event.key === "Escape") {
                      setIsEditing(false);
                      setName(doc.filename);
                    }
                  }}
                  className="h-9 rounded-xl bg-slate-900/60"
                  aria-label="Document name"
                  autoFocus
                />
                <Button size="sm" className="rounded-xl" onClick={handleRename}>
                  Save
                </Button>
              </div>
            ) : (
              <button
                className="text-left text-base font-semibold text-white hover:text-cyan-200"
                onClick={() => onOpen(doc)}
              >
                {doc.filename}
              </button>
            )}
            <p className="text-xs text-slate-400">
              Updated {doc.updatedAtFormatted ?? "just now"} • {doc.type ?? "Unclassified"}
            </p>
            <div className="flex flex-wrap gap-2">
              {doc.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full border-cyan-500/50 text-cyan-200">
                  #{tag}
                </Badge>
              ))}
              {doc.tags?.length === 0 ? (
                <button
                  className="text-xs text-cyan-300"
                  onClick={() => onTags(doc, "review")}
                  type="button"
                >
                  + tag
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs text-slate-400">
            {doc.expireDate ? (
              <Badge className="self-start rounded-full bg-amber-500/20 text-amber-300">
                Expires {doc.expireDateFormatted}
              </Badge>
            ) : null}
            {doc.links ? (
              <div className="flex flex-col gap-1">
                {doc.links.billId ? <LinkBadge label="Bill" /> : null}
                {doc.links.txnId ? <LinkBadge label="Transaction" /> : null}
                {doc.links.eventId ? <LinkBadge label="Event" /> : null}
                {doc.links.medId ? <LinkBadge label="Medication" /> : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-start justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 rounded-xl border border-slate-800 bg-slate-950">
              <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onOpen(doc)}>
                <ExternalLink className="mr-2 h-4 w-4" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSetExpiry(doc)}>
                <CalendarClock className="mr-2 h-4 w-4" /> Set expiry
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLink(doc)}>
                <Link2 className="mr-2 h-4 w-4" /> Link entities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(doc)}>
                <Share2 className="mr-2 h-4 w-4" /> Share access
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(doc)}>
                <Tags className="mr-2 h-4 w-4" /> Move to folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDownload(doc, "encrypted")}>Encrypted download</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(doc, "decrypted")}>Download decrypted</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete([doc.id])} className="text-red-400">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );

  return viewMode === "grid" ? (
    <motion.div layout className="h-full">
      {content}
    </motion.div>
  ) : (
    <motion.div layout className="h-full">
      {content}
    </motion.div>
  );
}

function LinkBadge({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="rounded-full border-slate-700 text-slate-200">
      Linked {label}
    </Badge>
  );
}
