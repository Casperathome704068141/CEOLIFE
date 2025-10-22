'use client';

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { DocCard } from "@/components/shared/doc-card";
import { VaultDropzone } from "@/components/shared/vault-dropzone";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCollection, useUser } from "@/firebase";
import type { DocumentDoc } from "@/lib/schemas";
import { format } from "date-fns";


export default function VaultDocumentsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { data: documents, loading: documentsLoading } = useCollection<DocumentDoc>('documents', {
    query: ['owner', '==', user?.uid],
    skip: !user?.uid,
  });

  const formatDate = (date: any) => {
    if (!date) return '';
    if (date.toDate) {
      // Firebase Timestamp
      return format(date.toDate(), 'MMM d, yyyy');
    }
    // String date
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vault documents"
        description="Encrypted repository with client-side AES and granular sharing controls."
        actions={
          <>
            <PagePrimaryAction>Upload document</PagePrimaryAction>
            <PageSecondaryAction>Scan & auto tag</PageSecondaryAction>
          </>
        }
      />

      <VaultDropzone onFiles={() => router.push('/vault/documents?intent=upload')} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documentsLoading ? (
          <p>Loading documents...</p>
        ) : (
          documents?.map((doc) => (
            <DocCard key={doc.id} name={doc.filename} type={doc.type} updatedAt={formatDate(doc.createdAt)} icon="FileText" tags={doc.tags} />
          ))
        )}
      </div>
      <Button variant="link" className="text-cyan-300" asChild>
        <Link href="/vault/sharing">Manage sharing</Link>
      </Button>
    </div>
  );
}

    