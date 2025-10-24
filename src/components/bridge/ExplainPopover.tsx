"use client";

import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  lines: string[];
};

export function ExplainPopover({ lines }: Props) {
  if (!lines.length) return null;
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-1 text-xs text-cyan-200 hover:text-cyan-100">
        <Info className="h-3.5 w-3.5" /> Why?
      </PopoverTrigger>
      <PopoverContent className="w-72 border-slate-800 bg-slate-900 text-slate-100">
        <ul className="list-disc space-y-2 pl-4 text-sm">
          {lines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

