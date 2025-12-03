import { Suspense } from 'react';
import { CapitalTerminal } from '@/components/capital/capital-terminal';
import { getFinancialSnapshot } from '@/lib/api/finance';
import { RefreshCw } from 'lucide-react';

export default async function CapitalPage() {
  // Parallel fetch: Get all accounts, portfolio data, and transaction backlog
  const data = await getFinancialSnapshot();

  return (
    <div className="h-[calc(100vh-8rem)] w-full text-slate-100">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin text-cyan-500" />
              <span className="text-[10px] tracking-widest text-cyan-700">
                ESTABLISHING SECURE UPLINK...
              </span>
            </div>
          </div>
        }
      >
        <CapitalTerminal initialData={data} />
      </Suspense>
    </div>
  );
}
