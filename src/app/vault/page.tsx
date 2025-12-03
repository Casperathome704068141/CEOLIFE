import { Suspense } from 'react';
import { VaultInterface } from '@/components/vault/vault-interface';
import { getDocuments, getVaultUsage } from '@/lib/api/vault';
import { Button } from '@/components/ui/button';
import { Home, ShieldLock } from 'lucide-react';
import Link from 'next/link';

export default async function VaultPage() {
  const [docs, usage] = await Promise.all([getDocuments(), getVaultUsage()]);

  return (
    <div className="flex h-screen w-full flex-col bg-[#050505] text-slate-100 overflow-hidden font-mono">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 uppercase text-[10px] tracking-widest font-bold"
            >
              <Home className="h-3 w-3" /> Mission Control
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldLock className="h-3 w-3 text-indigo-500" />
            <span>ENCRYPTION: AES-256 (CLIENT-SIDE)</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <Suspense fallback={<div className="p-10 text-center text-xs animate-pulse text-indigo-500">Decrypting Index...</div>}>
          <VaultInterface initialDocs={docs} usage={usage} />
        </Suspense>
      </main>
    </div>
  );
}
