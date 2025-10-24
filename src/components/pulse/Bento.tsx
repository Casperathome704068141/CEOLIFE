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
        "grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
