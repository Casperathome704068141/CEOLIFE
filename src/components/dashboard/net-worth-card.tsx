import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp } from "lucide-react";
import { netWorth } from "@/lib/data";

export function NetWorthCard() {
  const formattedNetWorth = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(netWorth);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline text-primary">
          {formattedNetWorth}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          +2.1% from last month
        </p>
      </CardContent>
    </Card>
  );
}
