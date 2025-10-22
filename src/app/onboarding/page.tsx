import { PageHeader, PagePrimaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { title: "Link accounts", description: "Connect Plaid, calendar, and email forwarding." },
  { title: "Add household contacts", description: "Save brothers and vendors for nudges — no extra logins required." },
  { title: "Upload first docs", description: "Drop receipts or IDs to test OCR." },
];

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Onboarding"
        description="Kickstart Beno 1017 with guided checklist."
        actions={<PagePrimaryAction>Start guided setup</PagePrimaryAction>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step) => (
          <Card key={step.title} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">{step.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
