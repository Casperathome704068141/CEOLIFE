"use client";

import { DocSummary } from "@/lib/graph/types";
import { formatRelative } from "@/lib/ui/format";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Props = {
  docs: DocSummary[];
};

export function DocsLens({ docs }: Props) {
  return (
    <div className="space-y-4">
      <Button variant="outline" className="w-full justify-start gap-2 border-slate-700 bg-slate-900/40 text-slate-200">
        <Upload className="h-4 w-4" />
        Drop or paste a document
      </Button>
      <div className="space-y-3">
        {docs.map(doc => (
          <div key={doc.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
            <p className="text-sm font-medium text-white">{doc.name}</p>
            <p className="text-xs text-slate-400">{doc.kind} · {formatRelative(doc.uploadedAt)}</p>
            {doc.link && (
              <a
                href={doc.link}
                className="mt-2 inline-block text-xs text-cyan-300 hover:text-cyan-200"
              >
                Open source
              </a>
            )}
          </div>
        ))}
        {docs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
            No linked documents yet.
          </div>
        )}
      </div>
    </div>
  );
}

