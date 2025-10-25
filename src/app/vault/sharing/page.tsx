
"use client";

import { PageHeader, PagePrimaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useUser } from "@/firebase";
import { ContactDoc } from "@/lib/schemas";


export default function VaultSharingPage() {
  const { user } = useUser();
  const { data: contacts, loading } = useCollection<ContactDoc>('contacts', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sharing & access"
        description="Role-based controls, emergency access, and time-boxed guest passes."
        actions={<PagePrimaryAction>Invite collaborator</PagePrimaryAction>}
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Access list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          {loading ? <p className="text-slate-400">Loading collaborators...</p> : (
            contacts?.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="text-xs text-slate-400">{contact.phone}</p>
                </div>
                <Button size="sm" variant="secondary" className="rounded-2xl">
                  Manage
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
