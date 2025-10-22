import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const sampleTransactions = Array.from({ length: 8 }).map((_, index) => ({
  id: `txn-${index}`,
  date: "Oct 21, 2024",
  description: index % 2 === 0 ? "Whole Foods" : "Spotify",
  category: index % 2 === 0 ? "Groceries" : "Subscriptions",
  amount: index % 2 === 0 ? -82.45 : -9.99,
  status: index % 3 === 0 ? "pending" : "cleared",
}));

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        description="Unified ledger from Plaid, OCR, and manual entries with Beno categorization intelligence."
        actions={
          <>
            <PagePrimaryAction>Add transaction</PagePrimaryAction>
            <PageSecondaryAction>Import CSV</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader className="flex flex-row flex-wrap items-center gap-3">
          <CardTitle className="text-lg text-white">Filter</CardTitle>
          <Input placeholder="Search description" className="max-w-xs rounded-2xl border-slate-800 bg-slate-900/70" />
          <Button size="sm" variant="secondary" className="rounded-2xl">
            Apply
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[420px]">
            <div className="divide-y divide-slate-900/60">
              {sampleTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between gap-4 px-6 py-4 text-sm">
                  <div>
                    <div className="font-medium text-white">{txn.description}</div>
                    <div className="text-xs text-slate-400">{txn.date}</div>
                  </div>
                  <div className="hidden text-xs uppercase tracking-wide text-cyan-300 md:block">
                    {txn.category}
                  </div>
                  <div className={`text-sm font-semibold ${txn.amount < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                    {txn.amount < 0 ? "-" : "+"}${Math.abs(txn.amount).toFixed(2)}
                  </div>
                  <Button size="sm" variant="ghost" className="rounded-2xl border border-slate-800">
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
