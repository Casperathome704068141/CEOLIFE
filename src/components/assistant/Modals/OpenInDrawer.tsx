"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function OpenInDrawer({
  open,
  onOpenChange,
  destination,
  preview,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination?: string;
  preview?: string;
  onConfirm?: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-l border-slate-800 bg-slate-950/95 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-slate-100">Open in {destination ?? "app"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <p>{preview ?? "Review the destination before leaving Beno."}</p>
          <Button onClick={onConfirm}>Open</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
