import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { savingsGoals } from "@/lib/data";

export function SavingsGoals() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Savings Goals
        </CardTitle>
        <CardDescription>
          Visual tracking of your financial goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {savingsGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.name}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium">{goal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">
                      ${goal.current.toLocaleString()}
                    </span>{" "}
                    / ${goal.target.toLocaleString()}
                  </p>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
