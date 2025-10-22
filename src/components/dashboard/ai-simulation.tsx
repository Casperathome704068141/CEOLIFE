"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AiSimulation() {
  const [scenario, setScenario] = React.useState("");
  const [result, setResult] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSimulate = () => {
    if (!scenario) return;
    setIsLoading(true);
    setResult("");
    // In a real app, this would call the forecastLifeScenario AI flow
    setTimeout(() => {
      setResult(
        `Simulating scenario: "${scenario}"\n\nFinancial Impact: Your monthly savings would decrease by approximately $300. Your timeline to reach the 'New Car' goal would be extended by 8 months.\n\nTime Impact: You would have approximately 10 fewer hours of free time per week for the duration of the diploma.`
      );
      setIsLoading(false);
    }, 1500);
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
