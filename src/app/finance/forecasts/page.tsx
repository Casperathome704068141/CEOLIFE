import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function ForecastsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Forecast scenarios"
        description="Adjust assumptions to see projected balance and gap automations."
        actions={
          <>
            <PagePrimaryAction>Save scenario</PagePrimaryAction>
            <PageSecondaryAction>Create automation</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Assumption sliders</CardTitle>
          <p className="text-xs text-slate-400">Income growth, rent change, and travel plan toggles.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-white">Income change</p>
            <Slider defaultValue={[5]} max={20} step={1} className="mt-2" />
          </div>
          <div>
            <p className="text-sm text-white">Rent adjustment</p>
            <Slider defaultValue={[2]} max={15} step={1} className="mt-2" />
          </div>
          <div>
            <p className="text-sm text-white">Travel fund</p>
            <Slider defaultValue={[30]} max={50} step={5} className="mt-2" />
          </div>
          <Button className="rounded-2xl">Simulate impact</Button>
        </CardContent>
      </Card>
    </div>
  );
}
