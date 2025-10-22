"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { cashflowData } from "@/lib/data";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
};

export function CashflowChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
        <CardDescription>Income vs. Expenses - Last 6 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
           <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={cashflowData}
              margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
               <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="income"
                type="monotone"
                strokeWidth={2}
                stroke="var(--color-income)"
                fill="var(--color-income)"
                dot={false}
              />
              <Line
                dataKey="expenses"
                type="monotone"
                strokeWidth={2}
                stroke="var(--color-expenses)"
                fill="var(--color-expenses)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
