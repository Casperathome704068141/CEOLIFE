
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

export function Bento({ className, children }: Props) {
  return (
    <div
      className={cn(
        "grid auto-rows-min grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)]",
        className
      )}
    >
      {children}
    </div>
  );
}
