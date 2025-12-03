"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Droplets,
  LucideIcon,
  Power,
  ShieldAlert,
  ShoppingCart,
  Thermometer,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitatAssetsResponse, HabitatInventoryItem } from "@/lib/api/habitat";

const healthClass = (value: number) => {
  if (value >= 85) return "bg-emerald-500/20 border-emerald-400/40 text-emerald-200";
  if (value >= 65) return "bg-amber-500/15 border-amber-400/30 text-amber-200";
  return "bg-rose-500/15 border-rose-400/30 text-rose-200";
};

type ZoneFilter = HabitatAssetsResponse["zones"][number]["id"] | "all";

type InventoryStatus = "critical" | "warning" | "ok";

const statusCopy: Record<InventoryStatus, { label: string; tone: string; bar: string }> = {
  critical: {
    label: "Critical",
    tone: "bg-rose-950/30 border-rose-800 text-rose-200",
    bar: "from-rose-500 to-rose-300",
  },
  warning: {
    label: "Low",
    tone: "bg-amber-950/30 border-amber-800 text-amber-200",
    bar: "from-amber-400 to-amber-200",
  },
  ok: {
    label: "Stable",
    tone: "bg-emerald-950/30 border-emerald-800 text-emerald-200",
    bar: "from-emerald-400 to-emerald-200",
  },
};

export function HabitatInterface({
  initialAssets,
  initialInventory,
}: {
  initialAssets: HabitatAssetsResponse;
  initialInventory: HabitatInventoryItem[];
}) {
  const [activeZone, setActiveZone] = useState<ZoneFilter>("all");

  const filteredTickets = useMemo(
    () =>
      initialAssets.tickets.filter((ticket) =>
        activeZone === "all" ? true : ticket.zoneId === activeZone,
      ),
    [activeZone, initialAssets.tickets],
  );

  const criticalInventory = useMemo(
    () => initialInventory.filter((item) => item.status !== "ok"),
    [initialInventory],
  );

  return (
    <div className="grid grid-cols-12 h-full divide-x divide-slate-800">
      {/* ZONE 1: DIGITAL TWIN */}
      <aside className="col-span-3 bg-[#080808] flex flex-col border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 bg-slate-900/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Zone Status</h2>
            <span className="text-[10px] text-slate-500">Digital Twin</span>
          </div>
          <div className="grid gap-2">
            {initialAssets.zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={cn(
                  "group flex items-center justify-between p-3 rounded border transition-all text-left",
                  activeZone === zone.id
                    ? "bg-emerald-950/20 border-emerald-500/50"
                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                      zone.health > 80
                        ? "bg-emerald-400"
                        : zone.health > 60
                          ? "bg-amber-400"
                          : "bg-rose-400",
                    )}
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <ZoneIcon icon={zone.icon} />
                      {zone.label}
                    </div>
                    <div className="text-[10px] text-slate-500">{zone.issues} Active Tickets</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full text-[10px] border",
                      healthClass(zone.health),
                    )}
                  >
                    {zone.health}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 space-y-3 border-t border-slate-800 bg-slate-900/10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Telemetry</div>
          <TelemetryRow
            label="Ambient Temp"
            value={`${initialAssets.telemetry.temperature}°F`}
            icon={Thermometer}
          />
          <TelemetryRow
            label="Humidity"
            value={`${initialAssets.telemetry.humidity}%`}
            icon={Droplets}
          />
          <TelemetryRow
            label="Power Load"
            value={`${initialAssets.telemetry.powerLoad}%`}
            icon={Zap}
          />
          <TelemetryRow
            label="Water Pressure"
            value={`${initialAssets.telemetry.waterPressure} psi`}
            icon={Wrench}
          />
        </div>
      </aside>

      {/* ZONE 2: OPERATIONS QUEUE */}
      <section className="col-span-6 bg-[#050505] flex flex-col">
        <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/50">
          <h2 className="text-xs font-bold text-white uppercase tracking-widest">Maintenance Tickets</h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="uppercase tracking-wider">Filter:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveZone("all")}
                className={cn(
                  "px-2 py-1 rounded border text-[10px] uppercase font-bold",
                  activeZone === "all"
                    ? "bg-slate-100 text-slate-900 border-slate-200"
                    : "border-slate-700 text-slate-300 hover:border-slate-500",
                )}
              >
                All
              </button>
              {initialAssets.zones.map((zone) => (
                <button
                  key={`${zone.id}-pill`}
                  onClick={() => setActiveZone(zone.id)}
                  className={cn(
                    "px-2 py-1 rounded border text-[10px] uppercase font-bold",
                    activeZone === zone.id
                      ? "bg-emerald-600 text-white border-emerald-400"
                      : "border-slate-700 text-slate-300 hover:border-slate-500",
                  )}
                >
                  {zone.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {filteredTickets.map((ticket) => (
            <article
              key={ticket.id}
              className={cn(
                "flex gap-4 p-4 rounded-lg border transition-colors cursor-pointer",
                ticket.priority === "critical"
                  ? "border-rose-900/50 bg-rose-950/10 hover:bg-rose-950/20"
                  : ticket.priority === "high"
                    ? "border-amber-900/40 bg-amber-950/10 hover:bg-amber-950/20"
                    : "border-slate-800 bg-slate-900/20 hover:bg-slate-900/40",
              )}
            >
              <div className="flex-col flex items-center gap-1 pt-1">
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                    ticket.priority === "critical"
                      ? "border-rose-500 text-rose-400"
                      : ticket.priority === "high"
                        ? "border-amber-500 text-amber-400"
                        : "border-slate-500 text-slate-400",
                  )}
                >
                  {ticket.priority === "critical" ? (
                    <AlertCircle className="h-2.5 w-2.5" />
                  ) : ticket.priority === "high" ? (
                    <ShieldAlert className="h-2.5 w-2.5" />
                  ) : (
                    <BadgeCheck className="h-2.5 w-2.5" />
                  )}
                </div>
                <div className="h-full w-px bg-slate-800" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-50">{ticket.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Zone: {ticket.zoneLabel} · Priority: {ticket.priority.toUpperCase()} · Due: {ticket.due}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {ticket.status}
                    </span>
                    {ticket.assignee ? (
                      <span className="px-2 py-1 rounded bg-emerald-900/30 border border-emerald-700 text-emerald-200">
                        Claimed by {ticket.assignee}
                      </span>
                    ) : (
                      <button className="px-2 py-1 rounded bg-emerald-600 text-[10px] font-bold uppercase hover:bg-emerald-500">
                        Claim
                      </button>
                    )}
                  </div>
                </div>
                {ticket.intent && (
                  <p className="text-xs text-slate-300/80">{ticket.intent}</p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Wrench className="h-3 w-3 text-emerald-400" />
                    {ticket.path}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span className="flex items-center gap-1">
                    <Truck className="h-3 w-3 text-cyan-400" />
                    {ticket.vendor}
                  </span>
                </div>
              </div>
            </article>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg p-6">
              No open tickets for this zone. All systems nominal.
            </div>
          )}
        </div>
      </section>

      {/* ZONE 3: LOGISTICS RAIL */}
      <aside className="col-span-3 bg-[#080808] border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <ShoppingCart className="h-3 w-3" /> Procurement
            </h2>
            <span className="text-[10px] text-slate-500">JIT Logistics</span>
          </div>

          <div className="space-y-2">
            {initialInventory.map((item) => {
              const status = statusCopy[item.status];
              const level = Math.min(100, Math.max(0, item.level));
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-3 rounded border flex flex-col gap-2",
                    status.tone,
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{item.name}</div>
                      <div className="text-[10px] text-slate-400">LEVEL: {level}% · Reorder @ {item.threshold}%</div>
                    </div>
                    <button className="h-7 px-3 rounded bg-slate-900/60 text-[10px] font-bold uppercase border border-slate-700 hover:border-slate-500">
                      Restock
                    </button>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={cn(
                        "h-full bg-gradient-to-r",
                        status.bar,
                      )}
                      style={{ width: `${level}%` }}
                    />
                  </div>
                  {item.vendor && (
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <Power className="h-3 w-3 text-cyan-400" /> Vendor: {item.vendor}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-4 bg-slate-900/20 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest">
            <span>Auto-Procurement Queue</span>
            <span className="text-emerald-400 font-bold">{criticalInventory.length} Alerts</span>
          </div>
          <div className="space-y-2">
            {criticalInventory.map((item) => (
              <div
                key={`queue-${item.id}`}
                className="flex items-center justify-between px-3 py-2 rounded bg-slate-900/50 border border-slate-800"
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-200">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {item.name}
                </div>
                <span className="text-[10px] text-slate-400">Reorder · ETA {item.eta || "N/A"}</span>
              </div>
            ))}

            {criticalInventory.length === 0 && (
              <div className="text-[10px] text-slate-500 px-3 py-2 rounded border border-dashed border-slate-800 text-center">
                No pending procurement. Inventory stable.
              </div>
            )}
          </div>
          <button className="w-full py-2 rounded bg-cyan-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-500 transition shadow-[0_0_15px_rgba(8,145,178,0.3)]">
            Initiate Order ({criticalInventory.length || initialInventory.length} Items)
          </button>
        </div>
      </aside>
    </div>
  );
}

function TelemetryRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex justify-between items-center text-[10px] text-slate-400">
      <span className="flex gap-2 items-center">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <span className="font-mono text-white">{value}</span>
    </div>
  );
}

function ZoneIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-3.5 w-3.5 text-slate-400" />;
}
