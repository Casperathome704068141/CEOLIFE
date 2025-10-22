import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo } from "lucide-react";
import { schedule } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

export function TodaySchedule() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
        <ListTodo className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {schedule.map((event, eventIdx) => (
              <li key={event.title}>
                <div className="relative pb-8">
                  {eventIdx !== schedule.length - 1 ? (
                    <span
                      className="absolute left-3 top-4 -ml-px h-full w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div>
                      <div className="relative px-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary ring-8 ring-background">
                          <span className="text-xs font-semibold text-primary">{event.time.split(' ')[1][0]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-foreground">
                        {event.title}
                        <span className="ml-2 font-medium text-muted-foreground">
                           ({event.time})
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
