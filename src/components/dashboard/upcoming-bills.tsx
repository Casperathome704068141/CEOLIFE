import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, type LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { bills } from "@/lib/data";

export function UpcomingBills() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Next Bills</CardTitle>
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bills.map((bill) => {
            const Icon = (LucideIcons[bill.icon as keyof typeof LucideIcons] as LucideIcon) ?? LucideIcons.Receipt;
            return (
              <div key={bill.name} className="flex items-center gap-4">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Due on {bill.dueDate}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  ${bill.amount.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
