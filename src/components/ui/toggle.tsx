"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ pressed = false, onPressedChange, className, children, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        data-state={pressed ? "on" : "off"}
        onClick={(event) => {
          onPressedChange?.(!pressed);
          props.onClick?.(event);
        }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition",
          pressed
            ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/60"
            : "text-slate-300 hover:bg-slate-800/60",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Toggle.displayName = "Toggle";
