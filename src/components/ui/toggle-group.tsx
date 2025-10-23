"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Toggle } from "./toggle";

type ToggleGroupContextValue = {
  type: "multiple" | "single";
  value: string[];
  onValueChange: (value: string[]) => void;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

interface ToggleGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  type: "multiple" | "single";
  className?: string;
  children: React.ReactNode;
}

export function ToggleGroup({ value, onValueChange, type, className, children }: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange, type }}>
      <div className={cn("inline-flex flex-wrap gap-2", className)}>{children}</div>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps extends React.ComponentProps<typeof Toggle> {
  value: string;
}

export function ToggleGroupItem({ value, children, className, ...props }: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within a ToggleGroup");
  }
  const pressed = context.value.includes(value);
  return (
    <Toggle
      {...props}
      className={cn("rounded-full", className)}
      pressed={pressed}
      onPressedChange={(next) => {
        if (context.type === "single") {
          context.onValueChange(next ? [value] : []);
        } else {
          const set = new Set(context.value);
          if (next) set.add(value);
          else set.delete(value);
          context.onValueChange(Array.from(set));
        }
      }}
    >
      {children}
    </Toggle>
  );
}
