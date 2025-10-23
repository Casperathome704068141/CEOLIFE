"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useHousehold } from "@/lib/household/useHousehold";
import type { MeterReading, Ticket } from "@/lib/household/types";
import { TicketEditor } from "./TicketEditor";
import { MetersCard } from "./MetersCard";
import { SupplyGauge } from "./SupplyGauge";
import { NudgeDialog } from "../NudgeDialog";

const ticketStatuses: Ticket["status"][] = ["open", "in_progress", "closed"];

export function ApartmentOverview() {
  const {
    tickets,
    meterReadings,
    shoppingLists,
    addMeterReading,
    upsertTicket,
    mutateTicketStatus,
    addShoppingItem,
    members,
    setActiveTab,
  } = useHousehold();
  const { toast } = useToast();

  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [explainMeter, setExplainMeter] = useState<MeterReading | null>(null);
  const [nudgeMember, setNudgeMember] = useState(members[0] ?? null);

  useEffect(() => {
    const handleAdd = () => setTicketDialogOpen(true);
    window.addEventListener("household:add-ticket", handleAdd);
    return () => window.removeEventListener("household:add-ticket", handleAdd);
  }, []);

  const groupedTickets = useMemo(() => {
    const map = new Map<Ticket["status"], Ticket[]>();
    ticketStatuses.forEach((status) => map.set(status, []));
    tickets.forEach((ticket) => {
      map.set(ticket.status, [...(map.get(ticket.status) ?? []), ticket]);
    });
    return map;
  }, [tickets]);

  const gaugeData = shoppingLists[0]?.items.slice(0, 3).map((item, index) => ({
    label: item.label,
    level: 100 - index * 25,
    threshold: 30,
  })) ?? [
    { label: "Detergent", level: 40, threshold: 30 },
    { label: "Paper towels", level: 60, threshold: 40 },
    { label: "Meds stock", level: 35, threshold: 25 },
  ];

  const meterTypes: MeterReading["type"][] = ["power", "water", "gas"];

  const anomalies = useMemo(() => {
    const map = new Map<MeterReading["type"], boolean>();
    meterTypes.forEach((type) => {
      const readings = meterReadings.filter((reading) => reading.type === type).sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime());
      if (readings.length >= 2) {
        const delta = readings[0].reading - readings[1].reading;
        map.set(type, Math.abs(delta) > readings[1].reading * 0.2);
      } else {
        map.set(type, false);
      }
    });
    return map;
  }, [meterReadings, meterTypes]);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-100">Maintenance board</CardTitle>
            <Button variant="ghost" className="rounded-xl" onClick={() => setTicketDialogOpen(true)}>
              New ticket
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {ticketStatuses.map((status) => {
              const entries = groupedTickets.get(status) ?? [];
              return (
                <div key={status} className="space-y-3 rounded-2xl bg-slate-900/50 p-3">
                  <p className="text-xs uppercase tracking-widest text-slate-500">{status.replace("_", " ")}</p>
                  {entries.length === 0 ? <p className="text-xs text-slate-500">No tickets</p> : null}
                  {entries.map((ticket) => (
                    <div key={ticket.id} className="space-y-2 rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-100">{ticket.title}</p>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-widest text-slate-400">
                          {ticket.severity}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl"
                          onClick={async () => {
                            const next = status === "open" ? "in_progress" : status === "in_progress" ? "closed" : "open";
                            await mutateTicketStatus({ ticketId: ticket.id, status: next });
                          }}
                        >
                          {status === "closed" ? "Reopen" : status === "open" ? "Start" : "Close"}
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setNudgeMember(members[0] ?? null)}>
                          Nudge
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => toast({ title: "Checklist", description: "Add checklist coming soon" })}
                        >
                          Add checklist
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
          <TicketEditor
            onSubmit={async (payload) => {
              await upsertTicket(payload);
              toast({ title: "Ticket created", description: payload.title });
            }}
            onClose={() => setTicketDialogOpen(false)}
          />
        </Dialog>

        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Meters</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {meterTypes.map((type) => (
              <div key={type} className="space-y-3">
                <MetersCard
                  type={type}
                  readings={meterReadings}
                  onLog={async (payload) => {
                    await addMeterReading(payload);
                    toast({ title: "Reading logged", description: `${type} updated` });
                  }}
                />
                {anomalies.get(type) ? (
                  <Button variant="ghost" size="sm" className="w-full rounded-xl text-amber-300" onClick={() => setExplainMeter(meterReadings.find((reading) => reading.type === type) ?? null)}>
                    Explain spike
                  </Button>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Supplies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {gaugeData.map((item) => (
                <SupplyGauge key={item.label} label={item.label} level={item.level} threshold={item.threshold} />
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full rounded-2xl border-cyan-600/40 text-cyan-200"
              onClick={async () => {
                const list = shoppingLists[0];
                if (!list) return;
                await addShoppingItem({ listId: list.id, label: "Restock essentials", priority: "high" });
                toast({
                  title: "Added to shopping",
                  description: "Essentials added",
                  action: (
                    <Button
                      variant="link"
                      className="text-cyan-300"
                      onClick={() => {
                        setActiveTab("shopping");
                      }}
                    >
                      View
                    </Button>
                  ),
                });
              }}
            >
              Add to shopping
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!explainMeter} onOpenChange={(value) => !value && setExplainMeter(null)}>
        <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950 text-slate-100">
          <DialogHeader>
            <DialogTitle>Meter anomaly</DialogTitle>
            <DialogDescription>
              We spotted a spike in {explainMeter?.type}. Recent readings shown below with a suggested cause.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-slate-200">
            {meterReadings
              .filter((entry) => entry.type === explainMeter?.type)
              .sort((a, b) => new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime())
              .slice(0, 6)
              .map((entry) => (
                <div key={entry.id} className="flex justify-between">
                  <span>{new Date(entry.takenAt).toLocaleDateString()}</span>
                  <span>{entry.reading}</span>
                </div>
              ))}
            <p className="text-xs text-amber-300">Suggested cause: unusual HVAC runtime. Consider scheduling a filter change.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setExplainMeter(null)} className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400">
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NudgeDialog member={nudgeMember} open={!!nudgeMember} onOpenChange={(value) => !value && setNudgeMember(null)} />
    </div>
  );
}
