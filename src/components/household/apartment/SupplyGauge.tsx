"use client";

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface SupplyGaugeProps {
  label: string;
  level: number; // 0-100
  threshold: number;
}

export function SupplyGauge({ label, level, threshold }: SupplyGaugeProps) {
  const color = level <= threshold ? "#f97316" : level <= threshold + 15 ? "#facc15" : "#34d399";
  const data = [{ name: label, value: level }];

  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border border-slate-900/60 bg-slate-950/80 p-4 text-slate-200">
      <div className="h-32 w-32">
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={12} data={data} startAngle={180} endAngle={-180}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={10} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm">
        <p className="font-medium text-slate-100">{label}</p>
        <p className="text-xs text-slate-400">{level}% remaining</p>
      </div>
    </div>
  );
}
