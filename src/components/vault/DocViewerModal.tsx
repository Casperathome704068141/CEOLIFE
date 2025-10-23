'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarClock, Copy, Download, Link2, Printer, Share2, Tag, XCircle } from 'lucide-react';
import type { VaultDocument } from '@/lib/vault/useVault';

interface DocViewerModalProps {
  doc: VaultDocument | null;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<VaultDocument>) => Promise<void> | void;
  onLink: () => void;
  onShare: () => void;
  onSetExpiry: () => void;
  onOpenRoute: (route: string) => void;
}

export function DocViewerModal({ doc, onClose, onUpdate, onLink, onShare, onSetExpiry, onOpenRoute }: DocViewerModalProps) {
  const [notes, setNotes] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (doc) {
      setNotes(doc.extracted?.text ?? '');
      setTagDraft('');
    }
  }, [doc]);

  const fieldEntries = useMemo(() => {
    if (!doc?.extracted?.fields) return [];
    return Object.entries(doc.extracted.fields);
  }, [doc]);

  if (!doc) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(doc.extracted?.text ?? '');
      toast({ title: 'Copied', description: 'OCR text copied to clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Unable to copy text.' });
    }
  };

  const handleDownload = (mode: 'encrypted' | 'decrypted') => {
    toast({
      title: mode === 'decrypted' ? 'Preparing decrypted copy' : 'Downloading encrypted file',
      description: 'A secure download will start shortly.',
    });
  };

  const handleAddTag = () => {
    if (!tagDraft.trim()) return;
    const updated = Array.from(new Set([...(doc.tags ?? []), tagDraft.trim()]));
    onUpdate(doc.id, { tags: updated });
    setTagDraft('');
  };

  return (
    <Dialog open={Boolean(doc)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="max-w-6xl overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/95 text-slate-100">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold text-white">{doc.filename}</DialogTitle>
          <DialogDescription>Securely decrypted on the client. Close to wipe from memory.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" className="rounded-2xl" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" /> Copy text
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => handleDownload('encrypted')}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => handleDownload('decrypted')}>
                <Printer className="mr-2 h-4 w-4" /> Print (secure)
              </Button>
            </div>
            <Tabs defaultValue="preview" className="rounded-3xl border border-slate-900/70 bg-slate-950/60 p-4">
              <TabsList className="grid h-10 grid-cols-2 rounded-2xl bg-slate-900/40">
                <TabsTrigger value="preview">Document</TabsTrigger>
                <TabsTrigger value="text">OCR text</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                <div className="flex h-[420px] items-center justify-center rounded-2xl bg-slate-900/40">
                  <p className="text-sm text-slate-500">Encrypted file preview placeholder.</p>
                </div>
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <Textarea
                  value={notes}
                  onChange={(event) => {
                    setNotes(event.target.value);
                    onUpdate(doc.id, {
                      extracted: { ...doc.extracted, text: event.target.value },
                    });
                  }}
                  className="h-[420px] rounded-2xl bg-slate-900/40"
                />
              </TabsContent>
            </Tabs>
          </div>
          <ScrollArea className="h-[560px] rounded-3xl border border-slate-900/70 bg-slate-950/60 p-5">
            <div className="space-y-5">
              <section>
                <h3 className="text-sm font-semibold text-white">Details</h3>
                <p className="mt-2 text-xs text-slate-400">Uploaded {doc.createdAtFormatted}</p>
                {doc.expireDate ? (
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-200">
                    <CalendarClock className="h-4 w-4" /> Expires {doc.expireDateFormatted}
                  </div>
                ) : (
                  <Button variant="ghost" className="mt-2 rounded-2xl text-slate-300" onClick={onSetExpiry}>
                    <CalendarClock className="mr-2 h-4 w-4" /> Set expiry
                  </Button>
                )}
              </section>
              <Separator className="border-slate-800" />
              <section>
                <h3 className="text-sm font-semibold text-white">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doc.tags?.map((tag) => (
                    <Badge key={tag} className="rounded-full bg-cyan-500/20 text-cyan-200">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={tagDraft}
                    onChange={(event) => setTagDraft(event.target.value)}
                    placeholder="Add tag"
                    className="h-9 rounded-xl bg-slate-900/60"
                  />
                  <Button size="sm" className="rounded-xl" onClick={handleAddTag}>
                    <Tag className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              </section>
              <Separator className="border-slate-800" />
              <section>
                <h3 className="text-sm font-semibold text-white">Extracted fields</h3>
                <div className="mt-3 space-y-3">
                  {fieldEntries.length === 0 ? (
                    <p className="text-xs text-slate-500">No structured fields captured yet.</p>
                  ) : (
                    fieldEntries.map(([key, value]) => (
                      <div key={key} className="rounded-xl bg-slate-900/40 p-3 text-xs text-slate-200">
                        <p className="font-semibold uppercase tracking-wide text-slate-400">{key}</p>
                        <Input
                          value={String(value ?? '')}
                          className="mt-1 h-9 rounded-xl bg-slate-950/60 text-sm"
                          onChange={(event) =>
                            onUpdate(doc.id, {
                              extracted: {
                                ...doc.extracted,
                                fields: {
                                  ...doc.extracted?.fields,
                                  [key]: event.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    ))
                  )}
                </div>
              </section>
              <Separator className="border-slate-800" />
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Linked entities</h3>
                {doc.links ? (
                  <div className="flex flex-col gap-2 text-xs text-cyan-200">
                    {doc.links.billId ? (
                      <Button
                        variant="ghost"
                        className="justify-start rounded-xl text-cyan-200 hover:bg-cyan-500/10"
                        onClick={() => onOpenRoute(`/finance/transactions?doc=${doc.id}`)}
                      >
                        <Link2 className="mr-2 h-4 w-4" /> Open in Finance
                      </Button>
                    ) : null}
                    {doc.links.eventId ? (
                      <Button
                        variant="ghost"
                        className="justify-start rounded-xl text-cyan-200 hover:bg-cyan-500/10"
                        onClick={() => onOpenRoute(`/schedule/calendar?event=${doc.links?.eventId}`)}
                      >
                        <Link2 className="mr-2 h-4 w-4" /> Open in Schedule
                      </Button>
                    ) : null}
                    {doc.links.medId ? (
                      <Button
                        variant="ghost"
                        className="justify-start rounded-xl text-cyan-200 hover:bg-cyan-500/10"
                        onClick={() => onOpenRoute(`/household/care?med=${doc.links?.medId}`)}
                      >
                        <Link2 className="mr-2 h-4 w-4" /> Open in Care
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No links yet.</p>
                )}
                <Button variant="secondary" className="rounded-2xl" onClick={onLink}>
                  <Link2 className="mr-2 h-4 w-4" /> Manage links
                </Button>
              </section>
              <Separator className="border-slate-800" />
              <section className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Sharing</h3>
                <Button variant="secondary" className="rounded-2xl" onClick={onShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Manage sharing
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start rounded-2xl text-red-300 hover:bg-red-500/10"
                  onClick={onClose}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Close & purge cache
                </Button>
              </section>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
