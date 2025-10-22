"use client";

import { Bell } from "lucide-react";
import { useUIState } from "@/store/ui-store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const notifications = {
  finance: [
    {
      title: "Budget nearing limit",
      body: "Dining out is at 82% utilization. Consider updating limits.",
      time: "2h ago",
    },
  ],
  home: [
    {
      title: "Filter replacement",
      body: "Apartment air filter due in 5 days.",
      time: "1d ago",
    },
  ],
  wellness: [
    {
      title: "Hydration low",
      body: "You logged < 1L water yesterday. Beno suggests a hydration goal.",
      time: "12h ago",
    },
  ],
};

export function NotificationsTray() {
  const { notificationsOpen, toggleNotifications } = useUIState();
  const total =
    notifications.finance.length +
    notifications.home.length +
    notifications.wellness.length;

  return (
    <Sheet open={notificationsOpen} onOpenChange={toggleNotifications}>
      <SheetTrigger className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-slate-200 shadow-inner shadow-cyan-500/10 transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
        <Bell className="h-5 w-5" />
        <Badge
          variant="secondary"
          className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-cyan-500 text-xs text-white"
        >
          {total}
        </Badge>
        <span className="sr-only">Open notifications</span>
      </SheetTrigger>
      <SheetContent className="w-[360px] border-l border-slate-800 bg-slate-950/95 text-slate-100 backdrop-blur">
        <SheetHeader>
          <SheetTitle>Beno Alerts</SheetTitle>
          <SheetDescription>
            Finance, household, and wellness intelligence curated for you.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {Object.entries(notifications).map(([key, entries]) => (
            <div key={key} className="space-y-3">
              <div className="text-xs uppercase tracking-wide text-cyan-300/70">
                {key}
              </div>
              <div className="space-y-2">
                {entries.map((notification) => (
                  <div
                    key={notification.title}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-lg shadow-slate-900/60"
                  >
                    <div className="text-sm font-medium text-white">
                      {notification.title}
                    </div>
                    <p className="text-xs text-slate-300">
                      {notification.body}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
