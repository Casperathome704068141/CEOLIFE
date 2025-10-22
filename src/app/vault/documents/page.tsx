'use client';

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { DocCard } from "@/components/shared/doc-card";
import { documents } from "@/lib/data";
import { VaultDropzone } from "@/components/shared/vault-dropzone";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VaultDocumentsPage() {
  const router = useRouter();

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
        {documents.map((doc) => (
          <DocCard key={doc.name} name={doc.name} type={doc.type} updatedAt={doc.date} iconName={doc.icon} tags={doc.tags} />
        ))}
      </div>
      <Button variant="link" className="text-cyan-300" asChild>
        <Link href="/vault/sharing">Manage sharing</Link>
      </Button>
    </div>
  );
}
