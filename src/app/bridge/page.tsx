'use client';

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useLiveQuery } from '@/lib/hooks/useLiveQuery';
import { useImpactGuard } from '@/lib/hooks/useImpactGuard';
import { AttentionQueue } from '@/components/bridge/AttentionQueue';
import { OpsSprintBar } from '@/components/bridge/OpsSprintBar';
import { TelemetryRail } from '@/components/bridge/TelemetryRail';
import { OperationalCanvas } from '@/components/bridge/OperationalCanvas';
import { EntityDrawers, type EntityDrawerState } from '@/components/bridge/EntityDrawers';
import { OmniBox } from '@/components/bridge/OmniBox';
import { ImpactPanel } from '@/components/bridge/ImpactPanel';
import type { ImpactPlan, QueueItem, CanvasContext } from '@/lib/graph/types';
import { useToast } from '@/hooks/use-toast';

async function fetchQueue(filter: string): Promise<{ items: QueueItem[] }> {
  const response = await fetch(`/api/bridge/queue?filter=${filter}`);
  if (!response.ok) throw new Error('Failed to fetch attention queue');
  return response.json();
}

async function fetchContext(id: string): Promise<{ context: CanvasContext }> {
  const response = await fetch(`/api/bridge/context?id=${id}`);
  if (!response.ok) throw new Error('Failed to fetch context');
  return response.json();
}

export default function BridgePage() {
  useLiveQuery();
  const { toast } = useToast();
  const { preview: previewImpact, commit } = useImpactGuard();

  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'monitor' | 'focus'>('monitor');
  const [impactPlan, setImpactPlan] = useState<ImpactPlan | null>(null);
  const [committing, setCommitting] = useState(false);
  const [drawer, setDrawer] = useState<EntityDrawerState>(null);

  const { data: queueData } = useQuery<{ items: QueueItem[] }>({
    queryKey: ['bridge', 'queue', filter],
    queryFn: () => fetchQueue(filter),
  });

  const { data: contextData } = useQuery<{ context: CanvasContext }>({
    queryKey: ['bridge', 'context', selectedId],
    queryFn: () => fetchContext(selectedId!),
    enabled: !!selectedId,
  });

  const handleAction = useCallback(
    async (action: QueueItem['actions'][number], item: QueueItem) => {
      setImpactPlan(null);
      if (action === 'Open') {
        setDrawer({ title: item.title, body: `Opening ${item.kind} details.` });
        return;
      }
      try {
        const plan = await previewImpact({ intent: `${item.kind}.${action.toLowerCase()}`, entityId: item.id });
        setImpactPlan(plan);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Impact preview failed',
          description: error instanceof Error ? error.message : 'Could not generate plan.',
          variant: 'destructive',
        });
      }
    },
    [previewImpact, toast],
  );

  const handleCommit = async () => {
    if (!selectedId || !contextData) return;
    const item = queueData?.items.find(i => i.id === selectedId);
    if (!item) return;

    setCommitting(true);
    try {
      await commit({
        type: 'bill.markPaid',
        payload: { billId: item.id, amount: 182 },
        idempotencyKey: crypto.randomUUID(),
        signedImpactPlan: impactPlan ?? undefined,
      });
      toast({ title: 'Committed', description: `${item.title} resolved.` });
      setImpactPlan(null);
      setSelectedId(null);
    } catch (error) {
      console.error(error);
      toast({ title: 'Commit failed', variant: 'destructive' });
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="relative grid h-[calc(100vh_-_8rem)] grid-cols-1 grid-rows-[auto,1fr] gap-4 p-4 lg:grid-cols-[280px,1fr] xl:grid-cols-[280px,1fr,200px]">
      <div className="col-span-1 space-y-4 lg:col-span-2 xl:col-span-3">
        <OmniBox />
        <OpsSprintBar mode={mode} onModeChange={setMode} />
      </div>

      <div className="hidden lg:block">
        <AttentionQueue
          items={queueData?.items ?? []}
          filter={filter}
          onFilterChange={setFilter}
          selectedId={selectedId}
          onSelect={(item) => setSelectedId(item.id)}
          onAction={handleAction}
        />
      </div>

      <div className="relative">
        <OperationalCanvas
          item={queueData?.items.find(item => item.id === selectedId)}
          context={contextData?.context}
        />
        <ImpactPanel
          plan={impactPlan}
          onCommit={handleCommit}
          onCancel={() => setImpactPlan(null)}
          committing={committing}
        />
      </div>

      <div className="hidden xl:block">
        <TelemetryRail mode={mode} />
      </div>

      <EntityDrawers state={drawer} onOpenChange={() => setDrawer(null)} />
    </div>
  );
}
