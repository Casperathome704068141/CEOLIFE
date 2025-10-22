import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function SimulationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Scenario simulations"
        description="Explore what-if cases such as income changes, travel, or debt payoff."
        actions={
          <>
            <PagePrimaryAction>Save scenario</PagePrimaryAction>
            <PageSecondaryAction>Share</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Parameters</CardTitle>
          <p className="text-xs text-slate-400">Adjust to see projected balance curve.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-white">Income delta</p>
            <Slider defaultValue={[10]} max={40} step={5} className="mt-2" />
          </div>
          <div>
            <p className="text-sm text-white">Travel budget</p>
            <Slider defaultValue={[20]} max={40} step={5} className="mt-2" />
          </div>
          <div>
            <p className="text-sm text-white">Rent change</p>
            <Slider defaultValue={[5]} max={20} step={1} className="mt-2" />
          </div>
          <Button className="rounded-2xl">Run Beno simulation</Button>
        </CardContent>
      </Card>
    </div>
  );
}
