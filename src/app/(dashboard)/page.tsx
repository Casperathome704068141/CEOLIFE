"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AttentionQueue } from "@/components/bridge/AttentionQueue";
import { OperationalCanvas } from "@/components/bridge/OperationalCanvas";
import { TelemetryRail } from "@/components/bridge/TelemetryRail";
import { OmniBox } from "@/components/bridge/OmniBox";
import { KPITiles } from "@/components/bridge/KPITiles";
import { OpsSprintBar } from "@/components/bridge/OpsSprintBar";
import { ImpactPanel } from "@/components/bridge/ImpactPanel";
import { EntityDrawers, EntityDrawerState } from "@/components/bridge/EntityDrawers";
import { useImpactGuard } from "@/lib/hooks/useImpactGuard";
import { useLiveQuery } from "@/lib/hooks/useLiveQuery";
import { useToast } from "@/hooks/use-toast";
import { QueueItem, Overview, CanvasContext, Command, ImpactPlan } from "@/lib/graph/types";

async function fetchOverview(): Promise<Overview> {
  const response = await fetch("/api/bridge/overview");
  if (!response.ok) throw new Error("Failed to load overview");
  const data = await response.json();
  return data.overview;
}

async function fetchQueue(filter: string): Promise<QueueItem[]> {
  const response = await fetch(`/api/bridge/queue?filter=${filter}`);
  if (!response.ok) throw new Error("Failed to load queue");
  const data = await response.json();
  return data.items as QueueItem[];
}

async function fetchContext(id?: string | null): Promise<CanvasContext | null> {
  if (!id) return null;
  const response = await fetch(`/api/bridge/context?id=${id}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.context as CanvasContext;
}

function buildCommandForItem(item: QueueItem): Command | null {
  const idempotencyKey = crypto.randomUUID();
  switch (item.kind) {
    case "bill":
      return {
        type: "bill.markPaid",
        payload: {
          billId: item.links?.[0]?.entityId ?? item.id,
          amount: 182,
        },
        idempotencyKey,
      };
    case "goalUnderfunded":
      return {
        type: "goal.allocate",
        payload: {
          goalId: item.links?.[0]?.entityId ?? item.id,
          amount: 300,
        },
        idempotencyKey,
      };
    case "doseOverdue":
      return {
        type: "dose.log",
        payload: {
          medicationId: item.links?.[0]?.entityId ?? item.id,
          doseId: item.links?.[1]?.entityId ?? item.id,
        },
        idempotencyKey,
      };
    case "refill":
      return {
        type: "refill.request",
        payload: {
          medicationId: item.links?.[0]?.entityId ?? item.id,
        },
        idempotencyKey,
      };
    default:
      return {
        type: "event.create",
        payload: {
          title: item.title,
          startsAt: new Date().toISOString(),
        },
        idempotencyKey,
      };
  }
}

export default function CommandBridgePage() {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [mode, setMode] = useState<"monitor" | "focus">("monitor");
  const [sprintRemaining, setSprintRemaining] = useState(25 * 60);
  const [sprintComplete, setSprintComplete] = useState(0);
  const [drawer, setDrawer] = useState<EntityDrawerState>(null);
  const [impactPlan, setImpactPlan] = useState<ImpactPlan | null>(null);
  const [pendingCommand, setPendingCommand] = useState<Command | null>(null);

  const { toast } = useToast();
  const { preview, commit } = useImpactGuard();

  useLiveQuery();

  const { data: overview } = useQuery({ queryKey: ["bridge", "overview"], queryFn: fetchOverview });
  const { data: queueItems } = useQuery({ queryKey: ["bridge", "queue", filter], queryFn: () => fetchQueue(filter) });
  const { data: context } = useQuery({
    queryKey: ["bridge", "context", selectedItem?.id],
    queryFn: () => fetchContext(selectedItem?.id ?? null),
    enabled: Boolean(selectedItem?.id),
  });

  const visibleQueue = useMemo(() => queueItems ?? [], [queueItems]);

  useEffect(() => {
    if (mode === "focus") {
      const timer = setInterval(() => {
        setSprintRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "monitor") {
      setSprintRemaining(25 * 60);
      setSprintComplete(0);
    }
  }, [mode]);

  useEffect(() => {
    if (!selectedItem && visibleQueue.length > 0) {
      setSelectedItem(visibleQueue[0]);
    }
  }, [visibleQueue, selectedItem]);

  const handleQueueAction = async (
    action: QueueItem["actions"][number],
    item: QueueItem
  ) => {
    switch (action) {
      case "Accept": {
        const command = buildCommandForItem(item);
        if (!command) return;
        try {
          const plan = await preview({
            intent: command.type.includes("bill")
              ? "bill.pay"
              : command.type.includes("goal")
              ? "goal.allocate"
              : command.type.includes("dose")
              ? "dose.log"
              : command.type.includes("refill")
              ? "refill.request"
              : "event.create",
            entityId: item.id,
            patch: command.payload,
          });
          setImpactPlan(plan);
          setPendingCommand({ ...command, signedImpactPlan: plan });
        } catch (error) {
          toast({ description: "Unable to prepare impact plan", variant: "destructive" });
        }
        break;
      }
      case "Open": {
        setDrawer({
          title: item.title,
          body: (
            <div className="space-y-3">
              <p className="text-slate-200">{item.detail}</p>
              <p className="text-xs text-slate-500">Priority score {item.priorityScore}</p>
              {context && (
                <div className="space-y-2 text-xs text-slate-400">
                  <p>Explain</p>
                  <ul className="list-disc pl-4">
                    {context.explain.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ),
        });
        break;
      }
      case "Simulate": {
        setImpactPlan(prev => prev);
        break;
      }
      case "Explain": {
        toast({ description: item.detail });
        break;
      }
      case "Nudge": {
        toast({ description: "Nudge scheduled" });
        break;
      }
      case "Schedule": {
        toast({ description: "Added to schedule" });
        break;
      }
      case "Ignore": {
        toast({ description: "Ignored for 7 days" });
        break;
      }
      default:
        break;
    }
  };

  const handleCommit = async () => {
    if (!pendingCommand) return;
    try {
      await commit(pendingCommand);
      toast({ description: "Action committed" });
      setImpactPlan(null);
      setPendingCommand(null);
      setSprintComplete(count => count + 1);
    } catch (error) {
      toast({ description: "Command failed", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <OpsSprintBar
        mode={mode}
        onModeChange={setMode}
        remainingSeconds={sprintRemaining}
        completed={sprintComplete}
        total={mode === "focus" ? 5 : visibleQueue.length}
      />
      <OmniBox />
      <KPITiles overview={overview} onSelectMetric={metric => toast({ description: `Switched to ${metric}` })} />
      <div className="grid gap-4 xl:grid-cols-[35%_45%_20%]">
        <div className="xl:h-[780px]">
          <AttentionQueue
            items={visibleQueue}
            filter={filter}
            focusMode={mode === "focus"}
            onFilterChange={value => setFilter(value)}
            selectedId={selectedItem?.id}
            onSelect={item => setSelectedItem(item)}
            onAction={handleQueueAction}
          />
        </div>
        <div className="relative xl:h-[780px]">
          <OperationalCanvas
            item={selectedItem}
            context={context}
            onSimulate={() => toast({ description: "Scenario simulation queued" })}
            onNudgePerson={() => toast({ description: "Nudge sent" })}
          />
          <ImpactPanel
            plan={impactPlan}
            onCommit={handleCommit}
            onCancel={() => {
              setImpactPlan(null);
              setPendingCommand(null);
            }}
          />
        </div>
        <TelemetryRail overview={overview} mode={mode} onMetricSelect={metric => toast({ description: `Focused on ${metric}` })} />
      </div>
      <EntityDrawers state={drawer} onOpenChange={open => !open && setDrawer(null)} />
    </div>
  );
}

