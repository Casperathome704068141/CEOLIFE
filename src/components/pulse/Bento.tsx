
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
        "grid auto-rows-auto grid-cols-1 gap-8 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
