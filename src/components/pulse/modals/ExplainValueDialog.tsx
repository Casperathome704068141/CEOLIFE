
"use client";

import { OddsRow } from "@/lib/pulse/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { valueScoreBand } from "@/lib/pulse/valueScore";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Props {
  row?: OddsRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExplainValueDialog({ row, open, onOpenChange }: Props) {
  const band = row ? valueScoreBand(row.valueScore) : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Value breakdown</DialogTitle>
          <DialogDescription>
            Understand why this edge is surfacing: implied probabilities, market consensus,
            context overlays and model weighting.
          </DialogDescription>
        </DialogHeader>
        {row ? (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              <section className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">{row.league}</p>
                    <h3 className="text-xl font-semibold">
                      {row.selection} — {row.market.toUpperCase()}
                    </h3>
                  </div>
                  <Badge className={band?.className}>{row.valueScore.toFixed(2)} / 10</Badge>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Stat label="Implied %" value={(row.implied * 100).toFixed(1) + "%"} />
                  <Stat label="Market avg %" value={(row.marketAvg * 100).toFixed(1) + "%"} />
                  <Stat label="Delta" value={(row.delta * 100).toFixed(1) + "%"} />
                </div>
              </section>
              <section className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Book lines
                </h4>
                <div className="space-y-2 rounded-lg border p-4">
                  {row.books.map((book) => (
                    <div key={book.name} className="flex flex-wrap items-center justify-between text-sm">
                      <span className="font-medium">{book.name}</span>
                      <span className="text-muted-foreground">
                        {book.price}
                        {book.line !== undefined ? ` | ${book.line}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Model inputs
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Stat label="Sentiment skew" value={`${Math.round((row.sentimentSkew ?? 0) * 100)}% public`} />
                  <Stat label="Form index" value={`${Math.round((row.formIndex ?? 0.5) * 100) / 100}`} />
                  <Stat label="Line move" value={`${(row.lineMove ?? 0).toFixed(2)} σ`} />
                  <Stat label="Weather impact" value={`${((row.weatherImpact ?? 0) * 100).toFixed(1)} bp`} />
                </div>
              </section>
              <section>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Transparency
                </h4>
                <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Score formula: <code>5 + 20×edge + 2×momentum + 5×contrarian + 5×weather + 3×form</code>
                  </p>
                  <Separator className="my-3" />
                  <p>
                    Edge = marketAvgImplied − implied. Momentum = tanh(lineMove / 2). Contrarian favors less
                    crowded sides. Weather impact derived from local forecast + market type.
                  </p>
                </div>
              </section>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground">Select a value row to inspect its breakdown.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background/80 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
