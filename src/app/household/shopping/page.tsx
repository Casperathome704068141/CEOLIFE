import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { shoppingList } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function ShoppingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Shopping & essentials"
        description="Shared list with AI prioritization and settlement flows."
        actions={
          <>
            <PagePrimaryAction>Add item</PagePrimaryAction>
            <PageSecondaryAction>Split cost</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Household list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {shoppingList.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-xs text-slate-400">Owner: {item.owner}</p>
              </div>
              <Button size="sm" variant="ghost" className="rounded-2xl border border-slate-800">
                {item.checked ? "Completed" : "Mark done"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
