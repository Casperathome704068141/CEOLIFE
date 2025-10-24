"use client";

import { type ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type EntityDrawerState = {
  title: string;
  body: ReactNode;
} | null;

type Props = {
  state: EntityDrawerState;
  onOpenChange: (open: boolean) => void;
};

export function EntityDrawers({ state, onOpenChange }: Props) {
  return (
    <Sheet open={Boolean(state)} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] border-slate-800 bg-slate-950 text-slate-100">
        <SheetHeader>
          <SheetTitle>{state?.title ?? ""}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4 text-sm text-slate-300">{state?.body}</div>
      </SheetContent>
    </Sheet>
  );
}

