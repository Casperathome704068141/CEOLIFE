import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ledger = [
  { description: "Utilities", amount: 220, payer: "Beno", status: "open" },
  { description: "Groceries", amount: 150, payer: "Marcus", status: "settled" },
];

export default function SplitPage() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Split ledger"
        description="Track household expenses, settlements, and instant pay links."
        actions={
          <>
            <PagePrimaryAction>Record payment</PagePrimaryAction>
            <PageSecondaryAction>Export ledger</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Shared expenses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          {ledger.map((entry) => (
            <div key={entry.description} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
              <div>
                <p className="font-medium text-white">{entry.description}</p>
                <p className="text-xs text-slate-400">Paid by {entry.payer}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-cyan-200">
                  {formatCurrency(entry.amount)}
                </span>
                <Button size="sm" variant="secondary" className="rounded-2xl">
                  {entry.status === "settled" ? "View" : "Settle now"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
