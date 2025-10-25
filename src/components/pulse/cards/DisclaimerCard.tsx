
import { Card, CardContent } from "@/components/ui/card";

export function DisclaimerCard() {
  return (
    <Card className="rounded-2xl border border-dashed border-primary/50 bg-primary/10 backdrop-blur">
      <CardContent className="space-y-2 p-6 text-sm leading-6 text-primary">
        <p className="font-semibold uppercase tracking-wide">Analytics only</p>
        <p>
          For information & entertainment only. No wagering or financial advice. Data may be delayed or inaccurate.
          Check your local laws.
        </p>
      </CardContent>
    </Card>
  );
}
