"use client";

import { useUIState } from "@/store/ui-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const roles: { label: string; value: "head" | "household" | "guest" }[] = [
  { label: "Head of Home", value: "head" },
  { label: "Household view", value: "household" },
  { label: "Guest snapshot", value: "guest" },
];

export function ProfileSwitcher() {
  const { activeProfile, setActiveProfile } = useUIState();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 px-3 text-sm text-slate-200 shadow-inner shadow-cyan-500/10"
        >
          <Users className="h-4 w-4 text-cyan-300" />
          <span className="hidden sm:inline">{roles.find((role) => role.value === activeProfile)?.label}</span>
          <span className="sm:hidden">{activeProfile}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100">
        <DropdownMenuLabel>Perspective</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeProfile}
          onValueChange={(value) => setActiveProfile(value as typeof activeProfile)}
        >
          {roles.map((role) => (
            <DropdownMenuRadioItem key={role.value} value={role.value}>
              {role.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setActiveProfile("head")}>Reset to Head</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
