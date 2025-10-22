import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const assets = [
  { name: "Dyson purifier", category: "Appliance", warranty: "Dec 2025" },
  { name: "LG washer", category: "Appliance", warranty: "Aug 2026" },
  { name: "Sony TV", category: "Electronics", warranty: "Jan 2027" },
];

export default function AssetsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="House assets"
        description="Track purchase details, warranties, and linked receipts."
        actions={
          <>
            <PagePrimaryAction>Add asset</PagePrimaryAction>
            <PageSecondaryAction>Schedule maintenance</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.name} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">{asset.name}</CardTitle>
              <p className="text-xs text-slate-400">{asset.category}</p>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              Warranty ends {asset.warranty}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
