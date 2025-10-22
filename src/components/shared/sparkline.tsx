"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

interface SparklineProps<T extends Record<string, unknown>> {
  data: T[];
  dataKey: keyof T & string;
  stroke?: string;
}

export function Sparkline<T extends Record<string, unknown>>({ data, dataKey, stroke = "#22d3ee" }: SparklineProps<T>) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data as Record<string, unknown>[]}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
