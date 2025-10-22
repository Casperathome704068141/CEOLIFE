"use client";

import { useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIState } from "@/store/ui-store";
import { useRouter } from "next/navigation";

const quickActions = [
  { label: "Add transaction", href: "/finance/transactions?intent=new" },
  { label: "Add bill", href: "/finance/budgets?modal=bill" },
  { label: "Scan receipt", href: "/vault/documents?intent=scan" },
  { label: "Create reminder", href: "/schedule/tasks?intent=new" },
  { label: "New automation rule", href: "/finance/rules?intent=new" },
];

export function CommandMenu() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIState();

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (["a", "u", "f", "s", "r"].includes(event.key) && (event.metaKey || event.ctrlKey)) {
        const actionMap: Record<string, string> = {
          a: "/finance/transactions?intent=new",
          u: "/vault/documents?intent=upload",
          f: "/finance/transactions?intent=filter",
          s: "/assistant",
          r: "/finance/rules",
        };
        const target = actionMap[event.key];
        if (target) {
          event.preventDefault();
          router.push(target);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [router, isCommandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={isCommandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="p-0 shadow-2xl">
        <Command className="rounded-lg border border-slate-800 bg-slate-950/95 text-slate-100">
          <CommandInput placeholder="Command Beno..." className="text-lg" />
          <CommandEmpty>No actions found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem key={action.label} onSelect={() => handleSelect(action.href)}>
                {action.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
