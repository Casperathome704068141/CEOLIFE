"use client";

import { Badge } from "@/components/ui/badge";

interface IdChipProps {
  value: string;
}

export function IdChip({ value }: IdChipProps) {
  return <Badge variant="outline">{value}</Badge>;
}
