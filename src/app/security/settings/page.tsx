import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
  { name: "Plaid", status: "Connected" },
  { name: "Google Calendar", status: "Connected" },
  { name: "Email ingestion", status: "Disabled" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage locale, currency, themes, notifications, and integrations."
        actions={
          <>
            <PagePrimaryAction>Save</PagePrimaryAction>
            <PageSecondaryAction>Feature flags</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
              <div>
                <p className="font-medium text-white">{integration.name}</p>
                <p className="text-xs text-slate-400">{integration.status}</p>
              </div>
              <Button size="sm" variant="secondary" className="rounded-2xl">
                Manage
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
