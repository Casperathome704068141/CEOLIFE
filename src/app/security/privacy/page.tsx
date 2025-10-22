import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Privacy dashboard"
        description="Audit logs, share visibility matrix, and data export controls."
        actions={
          <>
            <PagePrimaryAction>Download my data</PagePrimaryAction>
            <PageSecondaryAction>Rotate keys</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Access logs</CardTitle>
        </CardHeader>
        <CardContent className="h-48 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-center text-sm text-slate-500">
          Logs placeholder
        </CardContent>
      </Card>
    </div>
  );
}
