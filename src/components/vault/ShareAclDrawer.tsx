'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { ShareAclPayload, VaultDocument } from '@/lib/vault/useVault';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ShareAclDrawerProps {
  context: { ids: string[]; doc?: VaultDocument } | null;
  onClose: () => void;
  onShare: (ids: string[], payload: ShareAclPayload) => Promise<void> | void;
}

const defaultEntry = { id: '', role: 'viewer' as ShareAclPayload['people'][number]['role'], expiresAt: '' };

export function ShareAclDrawer({ context, onClose, onShare }: ShareAclDrawerProps) {
  const [entries, setEntries] = useState<ShareAclPayload['people']>([]);
  const [maskSensitive, setMaskSensitive] = useState(true);
  const [link, setLink] = useState<string | null>(null);
  const [loadingLink, setLoadingLink] = useState(false);
  const [accessWindow, setAccessWindow] = useState<{ start?: string; end?: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!context) {
      setEntries([]);
      setMaskSensitive(true);
      setLink(null);
      setAccessWindow({});
      return;
    }
    setEntries([]);
    setMaskSensitive(true);
    setLink(null);
    setAccessWindow({});
  }, [context]);

  if (!context) return null;

  const handleAdd = () => {
    setEntries((prev) => [...prev, { ...defaultEntry, id: '' }]);
  };

  const handleSave = async () => {
    await onShare(context.ids, {
      people: entries.filter((entry) => entry.id),
      maskSensitive,
      window: accessWindow,
    });
    onClose();
  };

  const handleGenerateLink = async () => {
    try {
      setLoadingLink(true);
      const response = await fetch('/api/vault/sign', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to sign');
      const data = (await response.json()) as { url: string; expiresAt: string };
      setLink(data.url);
      toast({ title: 'Secure link ready', description: `Expires ${data.expiresAt}` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Link error', description: 'Could not generate a secure link.' });
    } finally {
      setLoadingLink(false);
    }
  };

  return (
    <Sheet open={Boolean(context)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col gap-6 bg-slate-950/95 text-slate-100">
        <SheetHeader>
          <SheetTitle>Manage sharing</SheetTitle>
          <SheetDescription>
            Grant secure access without leaving the vault. You’re sharing {context.ids.length} document(s).
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index} className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-slate-300">Person</Label>
                <Badge variant="outline" className="rounded-full border-cyan-500/60 text-cyan-200">
                  {entry.role}
                </Badge>
              </div>
              <Input
                value={entry.id}
                onChange={(event) =>
                  setEntries((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, id: event.target.value } : item)),
                  )
                }
                placeholder="Email or phone"
                className="h-10 rounded-2xl bg-slate-900/60"
              />
              <Select
                value={entry.role}
                onValueChange={(role) =>
                  setEntries((prev) => prev.map((item, i) => (i === index ? { ...item, role: role as typeof entry.role } : item)))
                }
              >
                <SelectTrigger className="h-10 rounded-2xl bg-slate-900/60 text-slate-100">
                  <SelectValue placeholder="Viewer" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-slate-800 bg-slate-950">
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="emergency">Emergency access</SelectItem>
                </SelectContent>
              </Select>
              {entry.role === 'emergency' ? (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="datetime-local"
                    value={accessWindow.start ?? ''}
                    onChange={(event) => setAccessWindow((prev) => ({ ...prev, start: event.target.value }))}
                    className="h-10 rounded-2xl bg-slate-900/60"
                  />
                  <Input
                    type="datetime-local"
                    value={accessWindow.end ?? ''}
                    onChange={(event) => setAccessWindow((prev) => ({ ...prev, end: event.target.value }))}
                    className="h-10 rounded-2xl bg-slate-900/60"
                  />
                </div>
              ) : null}
            </div>
          ))}
          <Button variant="secondary" className="w-full rounded-2xl" onClick={handleAdd}>
            Add person
          </Button>
          <div className="flex items-center justify-between rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4">
            <div>
              <p className="text-sm font-semibold text-white">Mask sensitive fields</p>
              <p className="text-xs text-slate-500">Hide account numbers and IDs when sharing.</p>
            </div>
            <Switch checked={maskSensitive} onCheckedChange={setMaskSensitive} />
          </div>
          <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Secure view link</p>
                <p className="text-xs text-slate-500">Generate a time-boxed read-only link.</p>
              </div>
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={handleGenerateLink}
                disabled={loadingLink}
              >
                {loadingLink ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
              </Button>
            </div>
            {link ? (
              <p className="mt-2 truncate rounded-xl bg-slate-900/50 px-3 py-2 text-xs text-cyan-200">{link}</p>
            ) : null}
          </div>
        </div>
        <SheetFooter className="mt-auto flex gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white" onClick={handleSave}>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
