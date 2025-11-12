'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DocGrid } from '@/components/vault/DocGrid';
import { BulkBar } from '@/components/vault/BulkBar';
import { DocViewerModal } from '@/components/vault/DocViewerModal';
import { FiltersDrawer, VaultFilters } from '@/components/vault/FiltersDrawer';
import { LinkEntitiesDrawer } from '@/components/vault/LinkEntitiesDrawer';
import { MoveToFolderDialog } from '@/components/vault/MoveToFolderDialog';
import { SetExpiryDialog } from '@/components/vault/SetExpiryDialog';
import { ShareAclDrawer } from '@/components/vault/ShareAclDrawer';
import { UploadDocumentDialog } from '@/components/vault/UploadDocumentDialog';
import { ScanAutoTagDialog } from '@/components/vault/ScanAutoTagDialog';
import { useVault, VaultDocument } from '@/lib/vault/useVault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';

export default function DocumentsPage() {
  const {
    filteredDocs,
    isLoading,
    filters,
    setFilters,
    search,
    setSearch,
    upload,
    scanAndAutoTag,
    updateDoc,
    deleteDoc,
    linkEntities,
    setExpiry,
    shareAcl,
    moveToFolder,
    toggleTag,
    refresh,
  } = useVault();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeDoc, setActiveDoc] = useState<VaultDocument | null>(null);
  const [drawer, setDrawer] = useState<string | null>(null);
  const [dialog, setDialog] = useState<string | null>(null);

  const bulkContext = useMemo(() => {
    if (selected.length === 0) return null;
    return { ids: selected, doc: filteredDocs.find(d => d.id === selected[0]) };
  }, [selected, filteredDocs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vault"
        description="Securely store, organize, and access your personal documents with AI-powered tagging and reminders."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-2xl" onClick={() => setDialog('upload')}>
              Upload
            </Button>
            <Button className="rounded-2xl" onClick={() => setDialog('scan')}>
              Scan
            </Button>
          </div>
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Search vault..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs rounded-2xl bg-slate-900/60"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={() => setDrawer('filters')}>
            Filters
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => setBulkMode(!bulkMode)}
            data-active={bulkMode}
          >
            Bulk actions
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setViewMode('list')}>
            <List className={viewMode === 'list' ? 'text-cyan-300' : ''} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setViewMode('grid')}>
            <LayoutGrid className={viewMode === 'grid' ? 'text-cyan-300' : ''} />
          </Button>
        </div>
      </div>
      <DocGrid
        docs={filteredDocs}
        viewMode={viewMode}
        isLoading={isLoading}
        bulkMode={bulkMode}
        selectedIds={selected}
        onToggleSelect={(id) => {
          setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
        }}
        onOpen={setActiveDoc}
        onRename={(doc) => updateDoc(doc.id, { filename: doc.filename })}
        onTags={(doc, tag) => toggleTag(doc.id, tag)}
        onSetExpiry={(doc) => setDialog(`expiry:${doc.id}`)}
        onLink={(doc) => setDrawer(`link:${doc.id}`)}
        onShare={(doc) => setDrawer(`share:${doc.id}`)}
        onMove={(doc) => setDialog(`move:${doc.id}`)}
        onDelete={(ids) => deleteDoc(ids)}
        onDownload={() => {}}
      />
      <BulkBar
        visible={bulkMode && selected.length > 0}
        count={selected.length}
        onClear={() => setSelected([])}
        onShare={() => setDrawer(`share:${selected[0]}`)}
        onMove={() => setDialog(`move:${selected[0]}`)}
        onDelete={() => deleteDoc(selected)}
        onLink={() => setDrawer(`link:${selected[0]}`)}
        onSetExpiry={() => setDialog(`expiry:${selected[0]}`)}
        onAddTag={(tag) => selected.forEach((id) => toggleTag(id, tag))}
      />
      <DocViewerModal
        doc={activeDoc}
        onClose={() => setActiveDoc(null)}
        onUpdate={updateDoc}
        onLink={() => {
          setDrawer(`link:${activeDoc?.id}`);
          setActiveDoc(null);
        }}
        onShare={() => {
          setDrawer(`share:${activeDoc?.id}`);
          setActiveDoc(null);
        }}
        onSetExpiry={() => {
          setDialog(`expiry:${activeDoc?.id}`);
          setActiveDoc(null);
        }}
        onOpenRoute={() => {}}
      />
      <FiltersDrawer
        open={drawer === 'filters'}
        onOpenChange={() => setDrawer(null)}
        filters={filters}
        onApply={setFilters}
      />
      <LinkEntitiesDrawer
        doc={filteredDocs.find((d) => `link:${d.id}` === drawer)}
        onClose={() => setDrawer(null)}
        onLink={linkEntities}
      />
      <ShareAclDrawer
        context={bulkMode ? bulkContext : { ids: [drawer?.split(':')[1] ?? ''], doc: filteredDocs.find((d) => `share:${d.id}` === drawer) }}
        onClose={() => setDrawer(null)}
        onShare={shareAcl}
      />
      <UploadDocumentDialog open={dialog === 'upload'} onOpenChange={() => setDialog(null)} onUpload={upload} />
      <ScanAutoTagDialog
        open={dialog === 'scan'}
        onOpenChange={() => setDialog(null)}
        onScan={scanAndAutoTag}
        onSave={async (payload) => upload([payload.file], { ...payload, source: 'scan' })}
      />
      <SetExpiryDialog
        doc={filteredDocs.find((d) => `expiry:${d.id}` === dialog)}
        onClose={() => setDialog(null)}
        onSave={setExpiry}
      />
      <MoveToFolderDialog
        context={bulkMode ? bulkContext : { ids: [dialog?.split(':')[1] ?? ''], doc: filteredDocs.find((d) => `move:${d.id}` === dialog) }}
        onClose={() => setDialog(null)}
        onMove={moveToFolder}
      />
    </div>
  );
}
