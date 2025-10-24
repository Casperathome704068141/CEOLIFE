"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InlineTableProps<T> {
  columns: Array<{ key: keyof T; label: string; render?: (item: T, index: number) => ReactNode }>;
  data: T[];
  onAdd: () => void;
  onRemove?: (index: number) => void;
  emptyLabel?: string;
  children?: ReactNode;
}

export function InlineTable<T extends Record<string, unknown>>({
  columns,
  data,
  onAdd,
  onRemove,
  emptyLabel,
  children,
}: InlineTableProps<T>) {
  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-border/70">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.label}</TableHead>
              ))}
              {onRemove && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render ? column.render(item, index) : String(item[column.key] ?? "")}
                    </TableCell>
                  ))}
                  {onRemove && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                        Remove
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (onRemove ? 1 : 0)} className="text-center text-sm text-muted-foreground">
                  {emptyLabel ?? "No records yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={onAdd} size="sm">
          Add row
        </Button>
        {children}
      </div>
    </div>
  );
}
