"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  PagePrimaryAction,
  PageSecondaryAction,
} from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { VaultDropzone } from "@/components/vault/VaultDropzone";
import { UploadDocumentDialog } from "@/components/vault/UploadDocumentDialog";
import { ScanAutoTagDialog } from "@/components/vault/ScanAutoTagDialog";
import { FiltersDrawer } from "@/components/vault/FiltersDrawer";
import { DocGrid } from "@/components/vault/DocGrid";
import { DocViewerModal } from "@/components/vault/DocViewerModal";
import { SetExpiryDialog } from "@/components/vault/SetExpiryDialog";
import { LinkEntitiesDrawer } from "@/components/vault/LinkEntitiesDrawer";
import { ShareAclDrawer } from "@/components/vault/ShareAclDrawer";
import { MoveToFolderDialog } from "@/components/vault/MoveToFolderDialog";
import { BulkBar } from "@/components/vault/BulkBar";
import { useVault, type VaultDocument } from "@/lib/vault/useVault";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Filter, Grid3x3, LayoutList, Settings2, Users } from "lucide-react";

export type VaultViewMode = "grid" | "list";

export default function VaultDocumentsPage() {
  const {
    docs,
    isLoading,
    upload,
    scanAndAutoTag,
    updateDoc,
    deleteDoc,
    linkEntities,
    setExpiry,
    shareAcl,
    moveToFolder,
    filters,
    setFilters,
    search,
    setSearch,
    filteredDocs,
    toggleTag,
    refresh,
  } = useVault();
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<VaultViewMode>("grid");
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewerDoc, setViewerDoc] = useState<VaultDocument | null>(null);
  const [expiryDoc, setExpiryDoc] = useState<VaultDocument | null>(null);
  const [linkDoc, setLinkDoc] = useState<VaultDocument | null>(null);
  const [shareContext, setShareContext] = useState<{ ids: string[]; doc?: VaultDocument } | null>(null);
  const [moveDoc, setMoveDoc] = useState<{ ids: string[]; doc?: VaultDocument } | null>(null);

  const selectedDocs = useMemo(
    () => filteredDocs.filter((doc) => selected.includes(doc.id)),
    [filteredDocs, selected],
  );

  useEffect(() => {
    if (!bulkMode) {
      setSelected([]);
    }
  }, [bulkMode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === "INPUT") return;
      switch (event.key.toLowerCase()) {
        case "u":
          event.preventDefault();
          setUploadOpen(true);
          break;
        case "s":
          event.preventDefault();
          setScanOpen(true);
          break;
        case "f":
          event.preventDefault();
          setFiltersOpen(true);
          break;
        case "e":
          if (selected.length === 1) {
            event.preventDefault();
            const doc = filteredDocs.find((d) => d.id === selected[0]);
            if (doc) setExpiryDoc(doc);
          }
          break;
        case "delete":
        case "backspace":
          if (selected.length > 0) {
            event.preventDefault();
            void deleteDoc(selected);
            setSelected([]);
          }
          break;
        case "enter":
          if (selected.length === 1) {
            const doc = filteredDocs.find((d) => d.id === selected[0]);
            if (doc) setViewerDoc(doc);
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteDoc, filteredDocs, selected]);

  const toggleSelection = useCallback(
    (id: string) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearch("");
  }, [setFilters, setSearch]);

  const activeFilters = useMemo(() => {
    const tagsActive = filters.tags && filters.tags.length > 0;
    const typeActive = filters.types && filters.types.length > 0;
    const expiryActive = Boolean(filters.expiry);
    const linkedActive = Boolean(filters.linkedStatus);
    const sourceActive = Boolean(filters.source) && filters.source.length > 0;
    return tagsActive || typeActive || expiryActive || linkedActive || sourceActive;
  }, [filters]);

  const handleBulkShare = () => {
    if (selected.length === 0) return;
    setShareContext({ ids: selected });
  };

  const handleBulkMove = () => {
    if (selected.length === 0) return;
    setMoveDoc({ ids: selected });
  };

  const handleBulkLink = () => {
    if (selected.length === 0) return;
    setLinkDoc({
      ...selectedDocs[0],
    });
  };

  const manageSharing = () => {
    if (selected.length > 0) {
      setShareContext({ ids: selected, doc: selectedDocs[0] });
    } else {
      toast({
        title: "Select a document",
        description: "Choose a document to manage access or use bulk mode.",
      });
    }
  };

  const onDropUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      await upload(files);
      toast({
        title: "Upload started",
        description: `Uploaded ${files.length} document${files.length > 1 ? "s" : ""}. Parsing in background...`,
      });
    },
    [toast, upload],
  );

  return (
    <div className="space-y-8 pb-32">
      <PageHeader
        title="Documents"
        description="Encrypted digital vault for every important document. Upload, scan, tag, and share without ever leaving this workspace."
        actions={
          <>
            <PagePrimaryAction>
              <button type="button" onClick={() => setUploadOpen(true)} className="w-full">
                Upload document
              </button>
            </PagePrimaryAction>
            <PageSecondaryAction>
              <button type="button" onClick={() => setScanOpen(true)} className="w-full">
                Scan & auto-tag
              </button>
            </PageSecondaryAction>
          </>
        }
      />

      <VaultDropzone onFiles={onDropUpload} />

      <motion.div
        className="rounded-3xl border border-slate-800/60 bg-slate-950/70 p-4 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, tags, or OCR text"
              className="h-11 rounded-2xl bg-slate-900/60"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilters ? "default" : "secondary"}
                  className={cn(
                    "rounded-2xl",
                    activeFilters
                      ? "bg-cyan-500 text-white hover:bg-cyan-500/90"
                      : "bg-slate-900/60 text-slate-200",
                  )}
                  onClick={() => setFiltersOpen(true)}
                >
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Advanced filters</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-1">
              <Toggle
                pressed={viewMode === "grid"}
                onPressedChange={() => setViewMode("grid")}
                className="rounded-2xl"
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </Toggle>
              <Toggle
                pressed={viewMode === "list"}
                onPressedChange={() => setViewMode("list")}
                className="rounded-2xl"
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </Toggle>
            </div>
            <Button
              variant={bulkMode ? "default" : "outline"}
              className={cn("rounded-2xl", bulkMode ? "bg-cyan-600 text-white" : "border-slate-700")}
              onClick={() => setBulkMode((prev) => !prev)}
            >
              Bulk mode
            </Button>
            <Button
              variant="ghost"
              className="rounded-2xl text-cyan-300 hover:bg-slate-900/60"
              onClick={manageSharing}
            >
              <Users className="mr-2 h-4 w-4" /> Manage sharing
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-2xl text-slate-300 hover:bg-slate-900/60"
                  onClick={() => refresh()}
                >
                  <Settings2 className="mr-2 h-4 w-4" /> Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Reload latest changes</TooltipContent>
            </Tooltip>
          </div>
        </div>
        {activeFilters || search ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {search ? <span>Search: “{search}”</span> : null}
            {filters.types?.map((type) => (
              <span key={type} className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-200">
                Type: {type}
              </span>
            ))}
            {filters.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-200">
                #{tag}
              </span>
            ))}
            {filters.expiry ? <span>Expiry: {filters.expiry}</span> : null}
            {filters.linkedStatus ? <span>Linked: {filters.linkedStatus}</span> : null}
            {filters.source?.map((source) => (
              <span key={source}>Source: {source}</span>
            ))}
            <Button variant="ghost" size="sm" className="rounded-full text-slate-300" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        ) : null}
      </motion.div>

      <Separator className="border-slate-800/50" />

      <DocGrid
        docs={filteredDocs}
        viewMode={viewMode}
        bulkMode={bulkMode}
        selectedIds={selected}
        onToggleSelect={toggleSelection}
        onOpen={setViewerDoc}
        onRename={(doc) =>
          updateDoc(doc.id, { filename: doc.filename }).catch(() =>
            toast({ title: "Rename failed", description: "Unable to rename document." }),
          )
        }
        onTags={(doc, tag) => toggleTag(doc.id, tag)}
        onSetExpiry={setExpiryDoc}
        onLink={setLinkDoc}
        onShare={(doc) => setShareContext({ ids: [doc.id], doc })}
        onMove={(doc) => setMoveDoc({ ids: [doc.id], doc })}
        onDelete={(ids) => deleteDoc(ids)}
        isLoading={isLoading}
        onDownload={(doc, mode) =>
          toast({
            title: mode === "decrypted" ? "Preparing decrypted download" : "Downloading encrypted file",
            description: "Your secure download will begin shortly.",
          })
        }
      />

      <BulkBar
        visible={bulkMode && selected.length > 0}
        count={selected.length}
        onClear={() => setSelected([])}
        onShare={handleBulkShare}
        onMove={handleBulkMove}
        onDelete={() => deleteDoc(selected).then(() => setSelected([]))}
        onLink={handleBulkLink}
        onSetExpiry={() => {
          if (selected.length === 1) {
            const doc = filteredDocs.find((item) => item.id === selected[0]);
            if (doc) setExpiryDoc(doc);
          }
        }}
        onAddTag={(tag) => selected.forEach((id) => toggleTag(id, tag))}
      />

      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={async (files) => {
          await upload(files);
          toast({
            title: "Upload started",
            description: `Uploaded ${files.length} document${files.length > 1 ? "s" : ""}. Parsing in background...`,
          });
        }}
      />

      <ScanAutoTagDialog
        open={scanOpen}
        onOpenChange={setScanOpen}
        onScan={scanAndAutoTag}
        onSave={async ({ file, extracted, suggestions, links }) => {
          await upload([file], { extracted, suggestions, links, source: "scan" });
          toast({
            title: "Saved from scan",
            description: suggestions?.type
              ? `Saved document and suggested ${suggestions.type} tags.`
              : "Saved scanned document.",
          });
        }}
      />

      <FiltersDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onApply={setFilters}
      />

      <DocViewerModal
        doc={viewerDoc}
        onClose={() => setViewerDoc(null)}
        onUpdate={(id, payload) => updateDoc(id, payload)}
        onLink={() => viewerDoc && setLinkDoc(viewerDoc)}
        onShare={() => viewerDoc && setShareContext({ ids: [viewerDoc.id], doc: viewerDoc })}
        onSetExpiry={() => viewerDoc && setExpiryDoc(viewerDoc)}
        onOpenRoute={(route) => {
          toast({
            title: "Opening module",
            description: "You'll stay here unless you confirm navigation from the drawer.",
          });
          window.location.href = route;
        }}
      />

      <SetExpiryDialog
        doc={expiryDoc}
        onClose={() => setExpiryDoc(null)}
        onSave={(id, value) => setExpiry(id, value)}
      />

      <LinkEntitiesDrawer
        doc={linkDoc}
        onClose={() => setLinkDoc(null)}
        onLink={(id, links) => linkEntities(id, links)}
      />

      <ShareAclDrawer
        context={shareContext}
        onClose={() => setShareContext(null)}
        onShare={shareAcl}
      />

      <MoveToFolderDialog
        context={moveDoc}
        onClose={() => setMoveDoc(null)}
        onMove={moveToFolder}
      />
    </div>
  );
}
