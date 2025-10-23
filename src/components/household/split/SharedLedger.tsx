'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useHousehold } from '@/lib/household/useHousehold';
import type { LedgerEntry, Settlement } from '@/lib/household/types';
import { RecordPaymentDialog } from './RecordPaymentDialog';
import { SettleNowDialog } from './SettleNowDialog';
import { NudgeDialog } from '../NudgeDialog';

export function SharedLedger() {
  const {
    ledger,
    settlements,
    recordPayment,
    settleNow,
    exportLedger,
    members,
  } = useHousehold();
  const { toast } = useToast();

  const [recordOpen, setRecordOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);
  const [nudgeMember, setNudgeMember] = useState(members[0] ?? null);

  useEffect(() => {
    const handleAddPayment = () => setRecordOpen(true);
    window.addEventListener('household:add-ledger', handleAddPayment);
    return () => window.removeEventListener('household:add-ledger', handleAddPayment);
  }, []);

  const sortedLedger = useMemo(() => [...ledger].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [ledger]);
  const latestSettlement = settlements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg text-slate-100">Shared ledger</CardTitle>
          <p className="text-xs text-slate-500">Track reimbursements, settlements, and receipts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-2xl border-cyan-600/40 text-cyan-200" onClick={() => setRecordOpen(true)}>
            Record payment
          </Button>
          <Button variant="ghost" className="rounded-2xl text-xs uppercase tracking-widest text-slate-500" onClick={() => setSettleOpen(true)}>
            Settle now
          </Button>
          <Button
            variant="ghost"
            className="rounded-2xl text-xs uppercase tracking-widest text-slate-500"
            onClick={async () => {
              const csv = await exportLedger();
              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(csv);
              }
              toast({ title: 'Export copied', description: 'CSV for current month' });
            }}
          >
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-900/50">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-900/50">
                <TableHead>Date</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLedger.map((entry) => (
                <TableRow key={entry.id} className="border-slate-900/40">
                  <TableCell className="text-slate-300">{format(new Date(entry.date), 'MMM d')}</TableCell>
                  <TableCell className="font-medium text-slate-100">{entry.label}</TableCell>
                  <TableCell className={entry.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {entry.amount >= 0 ? '+' : ''}${Math.abs(entry.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-slate-300">{entry.payer}</TableCell>
                  <TableCell className="text-slate-500">{entry.note ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {latestSettlement ? (
          <div className="rounded-2xl bg-slate-900/60 p-3 text-xs text-slate-400">
            <p className="font-medium text-slate-200">Last settlement</p>
            <p>
              {latestSettlement.payer} paid ${latestSettlement.amount.toFixed(2)} on {new Date(latestSettlement.date).toLocaleDateString()} via {latestSettlement.method}
            </p>
          </div>
        ) : null}
      </CardContent>

      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <RecordPaymentDialog
            onSubmit={async ({ payer, amount, method, reference }) => {
              await recordPayment({ payer, amount, method, reference, currency: 'USD' });
              toast({ title: 'Payment recorded', description: `${payer} ${amount}` });
              setNudgeMember(members[0] ?? null);
            }}
            onClose={() => setRecordOpen(false)}
          />
      </Dialog>

      <Dialog open={settleOpen} onOpenChange={setSettleOpen}>
        <SettleNowDialog
          onSubmit={async (payload) => {
            await settleNow({ settlements: payload.settlements, currency: 'USD' });
            toast({ title: 'Settled', description: 'Balances updated' });
          }}
          onClose={() => setSettleOpen(false)}
        />
      </Dialog>
      
      <NudgeDialog member={nudgeMember} open={!!nudgeMember} onOpenChange={(value) => !value && setNudgeMember(null)} />
    </Card>
  );
}
