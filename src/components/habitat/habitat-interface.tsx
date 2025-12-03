"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  Car,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Droplets,
  Fingerprint,
  Gauge,
  LucideIcon,
  Power,
  Radar,
  ScanEye,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Thermometer,
  Truck,
  UtensilsCrossed,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  HabitatAssetsResponse,
  HabitatInventoryItem,
  HabitatZoneId,
} from "@/lib/api/habitat";

const healthClass = (value: number) => {
  if (value >= 85) return "bg-emerald-500/20 border-emerald-400/40 text-emerald-200";
  if (value >= 65) return "bg-amber-500/15 border-amber-400/30 text-amber-200";
  return "bg-rose-500/15 border-rose-400/30 text-rose-200";
};

type ZoneFilter = HabitatZoneId | "all";

type InventoryStatus = "critical" | "warning" | "ok";

type PillTone = "emerald" | "cyan" | "amber" | "slate";

const zoneIcons: Record<HabitatZoneId, LucideIcon> = {
  kitchen: UtensilsCrossed,
  garage: Car,
  utilities: Zap,
  systems: Shield,
};

type NetworkProfile = {
  id: string;
  label: string;
  band: string;
  load: number;
  uptime: string;
  secure: boolean;
  online: boolean;
};

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
  const [networks, setNetworks] = useState<NetworkProfile[]>([
    {
      id: "primary",
      label: "Habitat Mesh · Primary",
      band: "6 GHz",
      load: 64,
      uptime: "27d 04h",
      secure: true,
      online: true,
    },
    {
      id: "guests",
      label: "Crew Guests",
      band: "5 GHz",
      load: 21,
      uptime: "12d 15h",
      secure: true,
      online: true,
    },
    {
      id: "iot",
      label: "IoT / Sensors",
      band: "2.4 GHz",
      load: 38,
      uptime: "08d 19h",
      secure: false,
      online: true,
    },
  ]);

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

  const averageZoneHealth = useMemo(
    () =>
      Math.round(
        initialAssets.zones.reduce((acc, zone) => acc + zone.health, 0) /
          initialAssets.zones.length,
      ),
    [initialAssets.zones],
  );

  const openTicketCount = useMemo(
    () => initialAssets.tickets.filter((ticket) => ticket.status === "Open").length,
    [initialAssets.tickets],
  );

  const onlineNetworks = networks.filter((network) => network.online).length;

  const crew = [
    {
      id: "crew-1",
      name: "Beno",
      role: "Habitat Chief",
      status: "On-site",
      task: "Auditing PM compliance",
    },
    {
      id: "crew-2",
      name: "Camila",
      role: "Ops Specialist",
      status: "Remote",
      task: "Patching server rack firmware",
    },
    {
      id: "crew-3",
      name: "Noah",
      role: "Logistics",
      status: "En route",
      task: "Parts drop ETA 35m",
    },
  ];

  const automations = [
    {
      id: "auto-1",
      title: "Nightly Secure Sweep",
      description: "Lock doors, arm perimeter, and throttle guest Wi-Fi at 23:00.",
      status: "Armed",
    },
    {
      id: "auto-2",
      title: "Power Protection",
      description: "Route critical loads to UPS and shed nonessential draws during spikes.",
      status: "Active",
    },
    {
      id: "auto-3",
      title: "Water Integrity",
      description: "Monitor pressure deltas and auto-close valves on anomaly detection.",
      status: "Standby",
    },
  ];

  return (
    <div className="relative min-h-full bg-gradient-to-br from-[#030712] via-[#05070d] to-[#050505] text-slate-100">
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.2),transparent_30%)]" />
      <div className="relative h-full overflow-y-auto">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-6 shadow-2xl shadow-emerald-500/5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300/70">Habitat OS</p>
                <h1 className="text-2xl font-bold text-white">Habitat Command Surface</h1>
                <p className="text-sm text-slate-400">
                  Manage every system in the house—assets, members, inventory, connectivity—through a
                  single, SpaceX-grade interface.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Pill label="Readiness" value={`${averageZoneHealth}%`} tone="emerald" icon={ShieldCheck} />
                <Pill label="Network" value={`${onlineNetworks}/${networks.length} Online`} tone="cyan" icon={Signal} />
                <Pill label="Tickets" value={`${openTicketCount} Open`} tone="amber" icon={Activity} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3 text-[11px] uppercase tracking-wide text-slate-400">
              <StatusTile icon={Radar} label="Environmental" value={`${initialAssets.telemetry.temperature}°F / ${initialAssets.telemetry.humidity}%`} />
              <StatusTile icon={Zap} label="Power Load" value={`${initialAssets.telemetry.powerLoad}% util`} />
              <StatusTile icon={CircuitBoard} label="Automation" value="All services nominal" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <section className="col-span-12 xl:col-span-8 space-y-4">
              <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Zones & Digital Twin</p>
                    <h2 className="text-lg font-semibold text-white">Asset readiness by zone</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <button
                      onClick={() => setActiveZone("all")}
                      className={cn(
                        "rounded-full border px-3 py-1 font-bold uppercase tracking-wide",
                        activeZone === "all"
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                          : "border-slate-700 text-slate-300 hover:border-slate-500",
                      )}
                    >
                      All Zones
                    </button>
                    {initialAssets.zones.map((zone) => (
                      <button
                        key={`${zone.id}-pill`}
                        onClick={() => setActiveZone(zone.id)}
                        className={cn(
                          "rounded-full border px-3 py-1 font-bold uppercase tracking-wide",
                          activeZone === zone.id
                            ? "border-cyan-300 bg-cyan-500/20 text-cyan-100"
                            : "border-slate-700 text-slate-300 hover:border-slate-500",
                        )}
                      >
                        {zone.label}
                      </button>
                    ))}
                  </div>
                </header>

                <div className="grid gap-3 pt-3 lg:grid-cols-2">
                  {initialAssets.zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => setActiveZone(zone.id)}
                      className={cn(
                        "group flex flex-col gap-3 rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-slate-900/70",
                        activeZone === zone.id
                          ? "border-emerald-500/60 bg-slate-900/80"
                          : "border-slate-800/70 bg-slate-900/40",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg border text-white",
                              zone.health > 80
                                ? "border-emerald-500/40 bg-emerald-500/10"
                                : zone.health > 60
                                  ? "border-amber-400/40 bg-amber-500/10"
                                  : "border-rose-400/40 bg-rose-500/10",
                            )}
                          >
                            <ZoneIcon icon={zoneIcons[zone.id]} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{zone.label}</div>
                            <div className="text-[11px] text-slate-400">{zone.issues} open tickets</div>
                          </div>
                        </div>
                        <div className={cn("rounded-full border px-3 py-1 text-[11px]", healthClass(zone.health))}>
                          {zone.health}% integrity
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2 rounded-full border border-slate-800/80 px-2 py-1">
                          <ScanEye className="h-3 w-3 text-cyan-300" />
                          {activeZone === zone.id ? "Focused" : "Ready"}
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-800/80 px-2 py-1">
                          <Gauge className="h-3 w-3 text-emerald-300" />
                          Predictive maintenance on
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-800/80 px-2 py-1">
                          <Cloud className="h-3 w-3 text-slate-200" />
                          Sync nominal
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Live Telemetry</p>
                      <h3 className="text-lg font-semibold text-white">Environment controls</h3>
                    </div>
                    <div className="rounded-full border border-slate-700 px-3 py-1 text-[10px] text-emerald-200">
                      Stabilized
                    </div>
                  </div>
                  <div className="space-y-3">
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
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                    <button className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-bold uppercase text-emerald-200 hover:border-emerald-400">
                      Balance Climate
                    </button>
                    <button className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-bold uppercase text-cyan-200 hover:border-cyan-400">
                      Run Diagnostics
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Automation Stack</p>
                      <h3 className="text-lg font-semibold text-white">Guardrails & routines</h3>
                    </div>
                    <div className="rounded-full border border-slate-700 px-3 py-1 text-[10px] text-slate-200">
                      {automations.filter((automation) => automation.status !== "Standby").length} live
                    </div>
                  </div>
                  <div className="space-y-3">
                    {automations.map((automation) => (
                      <div
                        key={automation.id}
                        className="rounded-lg border border-slate-800/70 bg-slate-900/60 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white">{automation.title}</div>
                          <span
                            className={cn(
                              "rounded-full border px-3 py-1 text-[10px] uppercase tracking-wide",
                              automation.status === "Armed"
                                ? "border-emerald-400 text-emerald-200"
                                : automation.status === "Active"
                                  ? "border-cyan-400 text-cyan-200"
                                  : "border-amber-400 text-amber-200",
                            )}
                          >
                            {automation.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">{automation.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <section className="rounded-xl border border-slate-800/70 bg-slate-900/40">
                <header className="flex items-center justify-between border-b border-slate-800/70 px-4 py-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Operations Queue</p>
                    <h3 className="text-lg font-semibold text-white">Maintenance and tasks</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Pill label="Open" value={`${filteredTickets.length}`} tone="amber" icon={AlertCircle} />
                    <Pill label="Total" value={`${initialAssets.tickets.length}`} tone="slate" icon={BadgeCheck} />
                  </div>
                </header>

                <div className="divide-y divide-slate-800/70">
                  {filteredTickets.map((ticket) => (
                    <article
                      key={ticket.id}
                      className={cn(
                        "flex gap-4 p-4 transition hover:bg-slate-900/60",
                        ticket.priority === "critical"
                          ? "bg-rose-950/15"
                          : ticket.priority === "high"
                            ? "bg-amber-950/10"
                            : "bg-transparent",
                      )}
                    >
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border-2",
                            ticket.priority === "critical"
                              ? "border-rose-500 text-rose-400"
                              : ticket.priority === "high"
                                ? "border-amber-500 text-amber-400"
                                : "border-slate-500 text-slate-400",
                          )}
                        >
                          {ticket.priority === "critical" ? (
                            <AlertCircle className="h-3 w-3" />
                          ) : ticket.priority === "high" ? (
                            <ShieldAlert className="h-3 w-3" />
                          ) : (
                            <BadgeCheck className="h-3 w-3" />
                          )}
                        </div>
                        <div className="h-full w-px bg-slate-800/80" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-white">{ticket.title}</h4>
                            <p className="text-[11px] text-slate-400">
                              Zone: {ticket.zoneLabel} · Priority: {ticket.priority.toUpperCase()} · Due: {ticket.due}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wide">
                            <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200">
                              {ticket.status}
                            </span>
                            {ticket.assignee ? (
                              <span className="rounded border border-emerald-700 bg-emerald-900/30 px-2 py-1 text-emerald-200">
                                Claimed by {ticket.assignee}
                              </span>
                            ) : (
                              <button className="rounded bg-emerald-600 px-2 py-1 font-bold uppercase text-white hover:bg-emerald-500">
                                Claim
                              </button>
                            )}
                          </div>
                        </div>
                        {ticket.intent && <p className="text-xs text-slate-300/80">{ticket.intent}</p>}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 rounded-full border border-slate-800/80 px-2 py-1">
                            <Wrench className="h-3 w-3 text-emerald-400" />
                            {ticket.path}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-700" />
                          <span className="flex items-center gap-1 rounded-full border border-slate-800/80 px-2 py-1">
                            <Truck className="h-3 w-3 text-cyan-400" />
                            {ticket.vendor}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}

                  {filteredTickets.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-500">No open tickets for this zone. All systems nominal.</div>
                  )}
                </div>
              </section>
            </section>

            <aside className="col-span-12 xl:col-span-4 space-y-4">
              <section className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
                <header className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Network & Access</p>
                    <h3 className="text-lg font-semibold text-white">Wi‑Fi control center</h3>
                  </div>
                  <div className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase text-emerald-200">
                    Secure mesh
                  </div>
                </header>
                <div className="space-y-3">
                  {networks.map((network) => (
                    <div
                      key={network.id}
                      className="flex items-start justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 p-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Wifi className="h-4 w-4 text-cyan-300" />
                          {network.label}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Signal className="h-3 w-3 text-emerald-300" /> Load {network.load}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Radar className="h-3 w-3 text-slate-200" /> {network.band}
                          </span>
                          <span className="flex items-center gap-1">
                            <Power className="h-3 w-3 text-slate-300" /> Uptime {network.uptime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Fingerprint className="h-3 w-3 text-cyan-200" /> {network.secure ? "WPA3" : "Isolated"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNetworks((prev) =>
                            prev.map((item) =>
                              item.id === network.id ? { ...item, online: !item.online, load: item.online ? 0 : item.load || 18 } : item,
                            ),
                          )
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition",
                          network.online
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30"
                            : "border-rose-400 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30",
                        )}
                      >
                        {network.online ? "Online" : "Offline"}
                      </button>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-bold uppercase text-rose-200 hover:border-rose-400">
                      Network Lockdown
                    </button>
                    <button className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-bold uppercase text-emerald-200 hover:border-emerald-400">
                      Optimize Mesh
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
                <header className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Inventory & Logistics</p>
                    <h3 className="text-lg font-semibold text-white">Supply chain</h3>
                  </div>
                  <div className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase text-cyan-100">
                    {criticalInventory.length || initialInventory.length} items
                  </div>
                </header>
                <div className="space-y-2">
                  {initialInventory.map((item) => {
                    const status = statusCopy[item.status];
                    const level = Math.min(100, Math.max(0, item.level));
                    return (
                      <div key={item.id} className={cn("rounded-lg border p-3", status.tone)}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-300">
                              LEVEL: {level}% · Reorder @ {item.threshold}%
                            </div>
                          </div>
                          <button className="h-8 rounded border border-slate-700 bg-slate-900/60 px-3 text-[10px] font-bold uppercase hover:border-slate-500">
                            Restock
                          </button>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900">
                          <div
                            className={cn("h-full bg-gradient-to-r", status.bar)}
                            style={{ width: `${level}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Power className="h-3 w-3 text-cyan-300" /> Vendor: {item.vendor || "N/A"}
                          </span>
                          {item.eta && <span>ETA {item.eta}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-400">
                    <span>Auto-Procurement Queue</span>
                    <span className="text-emerald-300">{criticalInventory.length} alerts</span>
                  </div>
                  <div className="space-y-2">
                    {criticalInventory.map((item) => (
                      <div
                        key={`queue-${item.id}`}
                        className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/70 px-3 py-2"
                      >
                        <div className="flex items-center gap-2 text-[11px] text-slate-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          {item.name}
                        </div>
                        <span className="text-[10px] text-slate-400">Reorder · ETA {item.eta || "N/A"}</span>
                      </div>
                    ))}

                    {criticalInventory.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-800 px-3 py-2 text-center text-[10px] text-slate-500">
                        No pending procurement. Inventory stable.
                      </div>
                    )}
                  </div>
                  <button className="w-full rounded-lg bg-cyan-600 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(8,145,178,0.35)] hover:bg-cyan-500">
                    Initiate Order ({criticalInventory.length || initialInventory.length} Items)
                  </button>
                </div>
              </section>

              <section className="rounded-xl border border-slate-800/70 bg-slate-900/40 p-4">
                <header className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Household Crew</p>
                    <h3 className="text-lg font-semibold text-white">Members & access</h3>
                  </div>
                  <div className="rounded-full border border-slate-700 px-3 py-1 text-[10px] text-slate-200">
                    {crew.length} active profiles
                  </div>
                </header>
                <div className="space-y-2">
                  {crew.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[11px] font-bold uppercase text-slate-200">
                          {member.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{member.name}</div>
                          <div className="text-[11px] text-slate-400">{member.role}</div>
                          <div className="text-[11px] text-slate-300">{member.task}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-[10px] uppercase">
                        <span className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-1 text-emerald-100">
                          {member.status}
                        </span>
                        <button className="mt-1 rounded border border-slate-700 px-2 py-1 font-bold text-slate-200 hover:border-slate-500">
                          Manage Access
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
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
    <div className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-300">
      <span className="flex items-center gap-2 text-slate-200">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="font-mono text-white">{value}</span>
    </div>
  );
}

function ZoneIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-4 w-4" />;
}

function Pill({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: PillTone;
  icon: LucideIcon;
}) {
  const toneMap: Record<PillTone, string> = {
    emerald: "border-emerald-400 bg-emerald-500/15 text-emerald-100",
    cyan: "border-cyan-400 bg-cyan-500/15 text-cyan-100",
    amber: "border-amber-400 bg-amber-500/15 text-amber-100",
    slate: "border-slate-500 bg-slate-500/10 text-slate-200",
  } as const;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
        toneMap[tone],
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function StatusTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-slate-300">
      <Icon className="h-3.5 w-3.5 text-cyan-300" />
      <span>{label}</span>
      <span className="ml-auto font-mono text-white">{value}</span>
    </div>
  );
}
