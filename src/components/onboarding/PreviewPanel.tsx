"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOnboardingStore } from "@/lib/onboarding/state";

export function PreviewPanel() {
  const preview = useOnboardingStore((state) => state.preview);

  return (
    <Card className="border-border/80 bg-background/70">
      <CardHeader>
        <CardTitle className="text-lg">Live preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <section>
          <h3 className="text-xs uppercase text-muted-foreground">Readiness score</h3>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">{preview.readiness}%</p>
        </section>
        <Separator />
        <section className="space-y-2">
          <h3 className="text-xs uppercase text-muted-foreground">Forecast preview</h3>
          {preview.financeForecast.length ? (
            <div className="flex items-end gap-2">
              {preview.financeForecast.map((value, index) => (
                <div key={index} className="flex-1">
                  <div className="rounded bg-emerald-500/20 p-2 text-center text-xs font-medium">
                    +{value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Add income and bills to preview cashflow.</p>
          )}
        </section>
        <Separator />
        <section className="space-y-2">
          <h3 className="text-xs uppercase text-muted-foreground">Upcoming bills</h3>
          {preview.upcomingBills.length ? (
            <ul className="space-y-1">
              {preview.upcomingBills.map((bill) => (
                <li key={bill.name} className="flex items-center justify-between rounded border border-border/60 px-3 py-2">
                  <span>{bill.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {bill.due} · ${bill.amount}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Bills will appear here once entered.</p>
          )}
        </section>
        <Separator />
        <section className="space-y-2">
          <h3 className="text-xs uppercase text-muted-foreground">Care reminders</h3>
          {preview.care.length ? (
            <ul className="space-y-1">
              {preview.care.map((item, index) => (
                <li key={`${item.person}-${index}`} className="flex items-center justify-between rounded border border-border/60 px-3 py-2">
                  <span>{item.person}</span>
                  <span className="text-xs text-muted-foreground">{item.nextDose}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Medication reminders preview will show after adding meds.</p>
          )}
        </section>
        <Separator />
        <section className="space-y-2">
          <h3 className="text-xs uppercase text-muted-foreground">Automation checks</h3>
          {preview.rules.length ? (
            <ul className="space-y-1">
              {preview.rules.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between rounded border border-border/60 px-3 py-2">
                  <span>{rule.id}</span>
                  <span className="text-xs text-muted-foreground">{rule.count} recent hits</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Rules dry-run summary will show after enabling automations.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
