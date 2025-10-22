import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApartmentPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Apartment digital twin"
        description="Rent ledger, utilities, maintenance, and supply status in one pane."
        actions={
          <>
            <PagePrimaryAction>Log meter</PagePrimaryAction>
            <PageSecondaryAction>Raise maintenance ticket</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Rent ledger</CardTitle>
          </CardHeader>
          <CardContent className="h-40 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
            Ledger placeholder
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Utility meters</CardTitle>
          </CardHeader>
          <CardContent className="h-40 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
            Meter readings placeholder
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Supply levels</CardTitle>
          </CardHeader>
          <CardContent className="h-40 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
            Supply gauges placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
