
"use client";

import { PageHeader, PagePrimaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useUser } from "@/firebase";
import { DocumentDoc } from "@/lib/schemas";


export default function VaultIdsPage() {
  const { user } = useUser();
  const { data: documents, loading } = useCollection<DocumentDoc>('documents', {
    query: ['owner', '==', user?.uid],
    skip: !user?.uid,
  });

  const ids = documents?.filter(doc => doc.type === 'id') ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Identity hub"
        description="Expiry countdowns, biometric locks, and renewal checklists."
        actions={<PagePrimaryAction>Renewal checklist</PagePrimaryAction>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? <p className="text-slate-400">Loading IDs...</p> : (
          ids.map((id) => (
            <Card key={id.id} className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">{id.filename}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Owner</span>
                  <span>{id.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires</span>
                  <span>{(id.expireDate as any)?.toDate?.().toLocaleDateString() ?? 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
