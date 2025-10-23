"use client";

import { Button } from "@/components/ui/button";
import { SimResult } from "@/lib/sim/types";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TimelineOverlay {
  id: string;
  name: string;
  color: string;
  result: SimResult;
}

interface TimelineChartProps {
  result?: SimResult;
  overlays?: TimelineOverlay[];
  onOpenApplyPlan: (date?: string) => void;
  onOpenCompare: () => void;
}

export function TimelineChart({ result, overlays = [], onOpenApplyPlan, onOpenCompare }: TimelineChartProps) {
  const chartData = useMemo(() => {
    const horizon = Math.max(
      result?.monthly.length ?? 0,
      ...overlays.map((overlay) => overlay.result.monthly.length),
    );
    if (!horizon) return [] as Array<Record<string, number | string | null>>;
    const rows: Array<Record<string, number | string | null>> = [];
    for (let index = 0; index < horizon; index++) {
      const basePoint = result?.monthly[index] ?? result?.monthly.at(-1);
      const row: Record<string, number | string | null> = {
        date:
          basePoint?.date ??
          overlays[0]?.result.monthly[Math.min(index, overlays[0].result.monthly.length - 1)]?.date ??
          new Date().toISOString(),
        balance: basePoint?.balance ?? null,
        income: basePoint?.income ?? null,
        expenses: basePoint?.expenses ?? null,
      };
      overlays.forEach((overlay) => {
        const overlayPoint = overlay.result.monthly[Math.min(index, overlay.result.monthly.length - 1)];
        row[`overlay_${overlay.id}`] = overlayPoint?.balance ?? null;
      });
      rows.push(row);
    }
    return rows;
  }, [result, overlays]);

  const lastDate = result?.monthly.at(-1)?.date;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Timeline</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenCompare()}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
          >
            Compare
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onOpenApplyPlan(lastDate)}
            className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
          >
            Apply as plan
          </Button>
        </div>
      </div>
      <div className="h-72 w-full overflow-hidden rounded-3xl border border-slate-900/60 bg-slate-950/50 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onClick={(event) => {
              const date = event?.activeLabel as string | undefined;
              if (date) {
                onOpenApplyPlan(date);
              }
            }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                try {
                  return format(new Date(String(value)), "MMM");
                } catch (error) {
                  return String(value);
                }
              }}
              stroke="#475569"
            />
            <YAxis
              stroke="#475569"
              tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
            />
            <Tooltip
              contentStyle={{ background: "#020617", borderRadius: 16, borderColor: "#1e293b" }}
              labelFormatter={(value) => format(new Date(String(value)), "MMM yyyy")}
              formatter={(value: number | null, key) => {
                if (value == null || Number.isNaN(value)) {
                  return ["—", key.replace("_", " ")];
                }
                return [`$${Math.round(Number(value)).toLocaleString()}`, key.replace("_", " ")];
              }}
            />
            <Legend wrapperStyle={{ color: "#cbd5f5" }} />
            <Area type="monotone" dataKey="balance" name="Balance" stroke="#22d3ee" strokeWidth={2} fill="url(#balanceGradient)" />
            <Line type="monotone" dataKey="income" stroke="#38bdf8" strokeWidth={2} dot={false} name="Income" />
            <Line type="monotone" dataKey="expenses" stroke="#f472b6" strokeWidth={2} dot={false} name="Expenses" />
            {overlays.map((overlay) => (
              <Line
                key={overlay.id}
                type="monotone"
                dataKey={`overlay_${overlay.id}`}
                stroke={overlay.color}
                strokeWidth={2}
                dot={false}
                name={overlay.name}
              />
            ))}
            <Brush travellerWidth={12} height={24} stroke="#22d3ee" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
