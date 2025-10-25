
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { forecastLifeScenario } from "@/ai/flows/forecast-life-scenarios";
import { useToast } from "@/hooks/use-toast";

export function AiSimulation() {
  const [scenario, setScenario] = React.useState("");
  const [result, setResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSimulate = async () => {
    if (!scenario) return;
    setIsLoading(true);
    setResult("");
    try {
      const response = await forecastLifeScenario({
        scenarioDescription: scenario,
        currentSavings: 12000,
        monthlyIncome: 6800,
        monthlyExpenses: 5200,
      });
      setResult(
        `Financial Impact: ${response.financialImpactSummary}\n\nCashflow Projection: ${response.cashflowProjection}`
      );
    } catch (error) {
      toast({ variant: "destructive", title: "Simulation failed" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          AI Simulation Engine
        </CardTitle>
        <CardDescription>
          Forecast 'what-if' life scenarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-full">
        <Textarea
          placeholder="e.g., If I start a diploma next year at $300/month, how does that affect my savings?"
          className="flex-1"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
        />
        <Button onClick={handleSimulate} disabled={isLoading || !scenario}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Forecasting..." : "Forecast"}
        </Button>
        {result && (
          <div className="text-xs p-3 bg-muted/50 rounded-md border whitespace-pre-wrap">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
