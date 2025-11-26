
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OddsRow } from "@/lib/pulse/types";
import { valueScoreBand } from "@/lib/pulse/valueScore";
import { Bell, Info } from "lucide-react";

interface Props {
  rows: OddsRow[];
  onExplain: (row: OddsRow) => void;
  onTrack: (row: OddsRow) => void;
  onAlert: (row: OddsRow) => void;
  onAddToBrief: (payload: { title: string; body: string }) => Promise<void>;
}

export function OddsValueCard({ rows, onExplain, onTrack, onAlert, onAddToBrief }: Props) {
  const sorted = [...rows].sort((a, b) => b.valueScore - a.valueScore);

  return (
    <Card className="flex flex-col rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardHeader className="gap-3">
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span>Top odds & value plays</span>
          <Badge variant="outline">Odds</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No edges found under the active filters.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Pick</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Implied</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Market avg</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Delta</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Value score</TableHead>
                    <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((row) => {
                    const band = valueScoreBand(row.valueScore);
                    const sentiment = (row.sentimentSkew ?? 0.5) * 100;
                    return (
                      <TableRow key={row.id} className="hover:bg-primary/5">
                        <TableCell>
                          <div className="font-medium">{row.selection}</div>
                          <div className="text-xs text-muted-foreground">
                            {row.league} • {row.market.toUpperCase()}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">{(row.implied * 100).toFixed(1)}%</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{(row.marketAvg * 100).toFixed(1)}%</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{(row.delta * 100).toFixed(1)}%</TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          <span className={`${band.className} font-semibold`}>{row.valueScore.toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => onExplain(row)}>
                              <Info className="mr-1 h-4 w-4" /> Explain
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => onTrack(row)}>
                              Track
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => onAlert(row)}>
                              <Bell className="mr-1 h-4 w-4" /> Alert
                            </Button>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Sentiment {Number.isFinite(sentiment) ? sentiment.toFixed(0) : "0"}% public, weather impact
                            {" "}
                            {((row.weatherImpact ?? 0) * 100).toFixed(1)} bp.
                          </p>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>Edges refresh from partner feeds every minute.</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() =>
            onAddToBrief({
              title: "Value angles",
              body: "Sync these edges into the Beno briefing for stakeholder updates.",
            })
          }
        >
          Add to Beno brief
        </Button>
      </CardFooter>
    </Card>
  );
}
