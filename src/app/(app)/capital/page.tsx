import { Suspense } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Globe2,
  Home,
  LineChart,
  PieChart,
  RefreshCw,
  Rocket,
  Shield,
  ShieldCheck,
  Signal,
  Target,
  Wallet2,
  Wifi,
  PlusCircle,
} from 'lucide-react';

import { CapitalTerminal } from '@/components/capital/capital-terminal';
import { getFinancialSnapshot } from '@/lib/api/finance';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default async function CapitalPage() {
  const snapshot = await getFinancialSnapshot();
  const assets = snapshot.assets ?? [];
  const transactions = snapshot.transactions ?? [];

  const netWorth = assets.reduce((acc, asset) => acc + asset.balance * asset.price, 0);
  const liquidCash = assets.filter((a) => a.type === 'cash').reduce((acc, a) => acc + a.balance * a.price, 0);
  const equityExposure = assets.filter((a) => a.type === 'stock').reduce((acc, a) => acc + a.balance * a.price, 0);
  const cryptoExposure = assets.filter((a) => a.type === 'crypto').reduce((acc, a) => acc + a.balance * a.price, 0);

  const marketBoards = {
    equities: [
      { symbol: 'JPM', name: 'JPMorgan Chase', price: 148.33, change: 0.42, volume: '5.1M' },
      { symbol: 'NVDA', name: 'NVIDIA', price: 121.12, change: 1.85, volume: '9.3M' },
      { symbol: 'MSFT', name: 'Microsoft', price: 412.02, change: -0.34, volume: '6.4M' },
    ],
    crypto: [
      { symbol: 'BTC', name: 'Bitcoin', price: 64210, change: 2.4, dominance: '52%' },
      { symbol: 'ETH', name: 'Ethereum', price: 3405, change: -1.2, dominance: '19%' },
      { symbol: 'SOL', name: 'Solana', price: 142.11, change: 3.8, dominance: '3%' },
    ],
    forex: [
      { pair: 'EUR/USD', price: 1.0821, change: -0.08 },
      { pair: 'GBP/JPY', price: 185.43, change: 0.22 },
      { pair: 'USD/CAD', price: 1.3682, change: 0.15 },
    ],
  };

  const reservePlan = [
    { label: 'Emergency Cushion', target: 25000, funded: liquidCash },
    { label: 'Quarterly Tax Reserve', target: 12000, funded: 4500 },
    { label: 'Investment Dry Powder', target: 15000, funded: 6400 },
  ];

  const initiatives = [
    { title: 'Fund Roth IRA', status: 'Active', budget: '$6,000', progress: 0.42 },
    { title: 'Down Payment Pool', status: 'Stabilized', budget: '$50,000', progress: 0.58 },
    { title: 'Algorithmic Auto-Trade', status: 'Prototype', budget: '$12,000', progress: 0.22 },
  ];

  const allocations = assets.map((asset) => ({
    label: asset.name,
    allocation: asset.allocation,
    delta: asset.delta24h ?? 0,
    value: asset.balance * asset.price,
    symbol: asset.symbol,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050a12] to-black text-slate-50">
      {/* Command Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/60 bg-black/70 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-cyan-300 hover:bg-cyan-900/30">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Capital Command</p>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />Realtime feeds</span>
              <span className="flex items-center gap-2"><Wifi className="h-3 w-3" />Low latency</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" />PCI hardened</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-cyan-700/60 bg-cyan-900/30 text-[11px] text-cyan-200">
            Net Worth ▲ {(netWorth / 1_000_000).toFixed(2)}M
          </Badge>
          <Button variant="outline" className="border-slate-700 bg-slate-900/60 text-xs text-slate-200">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin-slow" /> Sync Ledgers
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        {/* Executive Overview */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-800/60 bg-slate-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Total Net Worth</CardTitle>
              <LineChart className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-semibold tracking-tight text-white">${netWorth.toLocaleString()}</div>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <ArrowUpRight className="h-4 w-4" /> +1.4% today · Signals green
              </div>
              <Progress value={Math.min(100, (netWorth / 1_000_000) * 100)} className="h-1.5 bg-slate-800" />
              <div className="grid grid-cols-3 gap-3 text-xs text-slate-400">
                <div>
                  <p className="text-[11px] uppercase">Liquidity</p>
                  <p className="font-mono text-sm text-white">${liquidCash.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase">Equity</p>
                  <p className="font-mono text-sm text-white">${equityExposure.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase">Crypto</p>
                  <p className="font-mono text-sm text-white">${cryptoExposure.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/60 bg-slate-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Budget Control</CardTitle>
              <PieChart className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase">Monthly burn</span>
                <span className="font-mono text-slate-200">${snapshot.monthlyBurn.toLocaleString()} / ${snapshot.burnTarget.toLocaleString()}</span>
              </div>
              <Progress value={(snapshot.monthlyBurn / snapshot.burnTarget) * 100} className="h-1.5 bg-slate-800" />
              <div className="rounded-lg border border-slate-800/70 bg-black/40 p-3 text-xs text-slate-300">
                Autopilot allocates the next payout across tax, fixed costs, and dry powder. No alerts pending.
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] uppercase text-slate-500">
                <div className="rounded-md border border-slate-800/60 bg-slate-900/40 p-2 text-center">
                  <p className="text-slate-300">Runway</p>
                  <p className="mt-1 font-mono text-sm text-white">7.4 months</p>
                </div>
                <div className="rounded-md border border-slate-800/60 bg-slate-900/40 p-2 text-center">
                  <p className="text-slate-300">Bills</p>
                  <p className="mt-1 font-mono text-sm text-white">$3,112 due</p>
                </div>
                <div className="rounded-md border border-slate-800/60 bg-slate-900/40 p-2 text-center">
                  <p className="text-slate-300">Approvals</p>
                  <p className="mt-1 font-mono text-sm text-white">3 queued</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/60 bg-slate-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-200">Risk Console</CardTitle>
              <Shield className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-emerald-100">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em]"><Signal className="h-3 w-3" /> Systems nominal</div>
                <Badge className="bg-emerald-600 text-[10px]">Stable</Badge>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2 text-xs uppercase"><Activity className="h-3 w-3 text-amber-400" /> Volatility</div>
                <span className="font-mono text-xs text-amber-200">0.62 beta</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2 text-xs uppercase"><Target className="h-3 w-3 text-cyan-400" /> Target Yield</div>
                <span className="font-mono text-xs text-emerald-200">8.4%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2 text-xs uppercase"><Clock className="h-3 w-3 text-pink-400" /> Horizon</div>
                <span className="font-mono text-xs text-slate-100">36 months</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Markets + Programs */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-800/60 bg-slate-900/30 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-200">Global Markets Board</CardTitle>
                <p className="text-[12px] text-slate-500">Live views of equities, crypto, and FX flows</p>
              </div>
              <Badge variant="outline" className="border-cyan-700/60 bg-cyan-900/30 text-[11px] text-cyan-200">
                Streaming · Multi asset
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3 rounded-lg border border-slate-800/60 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase">Equities</span>
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  {marketBoards.equities.map((eq) => (
                    <div key={eq.symbol} className="flex items-center justify-between rounded-md border border-slate-800/60 bg-slate-950/50 px-2 py-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{eq.symbol}</div>
                        <div className="text-[11px] text-slate-500">{eq.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-white">${eq.price}</div>
                        <div className={`text-[11px] ${eq.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{eq.change >= 0 ? '+' : ''}{eq.change}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-slate-800/60 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase">Crypto</span>
                  <Rocket className="h-3 w-3 text-amber-400" />
                </div>
                <div className="space-y-2">
                  {marketBoards.crypto.map((coin) => (
                    <div key={coin.symbol} className="flex items-center justify-between rounded-md border border-slate-800/60 bg-slate-950/50 px-2 py-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{coin.symbol}</div>
                        <div className="text-[11px] text-slate-500">{coin.name} · Dom {coin.dominance}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-white">${coin.price.toLocaleString()}</div>
                        <div className={`text-[11px] ${coin.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{coin.change >= 0 ? '+' : ''}{coin.change}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-slate-800/60 bg-black/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase">FX</span>
                  <Globe2 className="h-3 w-3 text-blue-400" />
                </div>
                <div className="space-y-2">
                  {marketBoards.forex.map((fx) => (
                    <div key={fx.pair} className="flex items-center justify-between rounded-md border border-slate-800/60 bg-slate-950/50 px-2 py-2">
                      <div className="text-sm font-semibold text-white">{fx.pair}</div>
                      <div className="text-right">
                        <div className="font-mono text-sm text-white">{fx.price}</div>
                        <div className={`text-[11px] ${fx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fx.change >= 0 ? '+' : ''}{fx.change}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800/60 bg-slate-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-200">Programs & Goals</CardTitle>
                <p className="text-[12px] text-slate-500">Allocate surplus with JPM-grade discipline</p>
              </div>
              <Button size="sm" className="h-8 border border-cyan-700/60 bg-cyan-900/30 text-[11px] text-cyan-100">
                <PlusCircle className="mr-2 h-3 w-3" /> New mandate
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {initiatives.map((initiative) => (
                <div key={initiative.title} className="rounded-lg border border-slate-800/60 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{initiative.title}</div>
                      <div className="text-[11px] text-slate-500">Budget {initiative.budget} · {initiative.status}</div>
                    </div>
                    <Badge className="bg-cyan-600/80 text-[10px]">Autonomous</Badge>
                  </div>
                  <div className="mt-2">
                    <Progress value={initiative.progress * 100} className="h-1.5 bg-slate-800" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Allocations + Reserves */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-800/60 bg-slate-900/30 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-200">Allocation Stack</CardTitle>
                <p className="text-[12px] text-slate-500">Holdings across stocks, crypto, cash, and alternative flows</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 border-slate-700 bg-slate-900/60 text-[11px] text-slate-200">
                <Wallet2 className="mr-2 h-3 w-3" /> Rebalance
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {allocations.map((allocation) => (
                <div key={allocation.symbol} className="rounded-lg border border-slate-800/60 bg-black/40 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{allocation.label}</div>
                      <div className="text-[11px] text-slate-500">{allocation.symbol}</div>
                    </div>
                    <Badge variant="outline" className="border-slate-700 bg-slate-900/60 text-[10px] text-cyan-200">
                      ${allocation.value.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Allocation</span>
                    <span className="font-mono text-xs text-white">{allocation.allocation}%</span>
                  </div>
                  <Progress value={allocation.allocation} className="h-1.5 bg-slate-800" />
                  <div className={`mt-2 text-[11px] ${allocation.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {allocation.delta >= 0 ? '+' : ''}{allocation.delta}% 24h drift
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800/60 bg-slate-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-200">Capital Reserves</CardTitle>
                <p className="text-[12px] text-slate-500">Layered buffers for resilience</p>
              </div>
              <Badge variant="outline" className="border-emerald-700/60 bg-emerald-900/30 text-[11px] text-emerald-100">Auto-fill</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {reservePlan.map((reserve) => {
                const percent = Math.min(100, (reserve.funded / reserve.target) * 100);
                return (
                  <div key={reserve.label} className="rounded-lg border border-slate-800/60 bg-black/40 p-3">
                    <div className="flex items-center justify-between text-sm text-white">
                      <span>{reserve.label}</span>
                      <span className="font-mono text-xs text-slate-300">${reserve.funded.toLocaleString()} / ${reserve.target.toLocaleString()}</span>
                    </div>
                    <Progress value={percent} className="mt-2 h-1.5 bg-slate-800" />
                    <div className="mt-1 text-[11px] text-slate-500">{percent.toFixed(1)}% funded</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        {/* Operations & Timeline */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-slate-800/60 bg-slate-900/30 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-200">Treasury Timeline</CardTitle>
                <p className="text-[12px] text-slate-500">Latest transactions and scheduled movements</p>
              </div>
              <Badge className="bg-cyan-700/60 text-[11px]">Realtime</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-black/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${tx.amount >= 0 ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/40 text-rose-200'}`}>
                      {tx.category.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{tx.merchant}</div>
                      <div className="text-[11px] text-slate-500">{tx.date} · {tx.category} · {tx.status}</div>
                    </div>
                  </div>
                  <div className={`font-mono text-sm ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-300'}`}>
                    {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800/60 bg-slate-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-200">Threats & Opportunities</CardTitle>
                <p className="text-[12px] text-slate-500">Autonomous signals with next steps</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-amber-900/60 bg-amber-950/40 p-3 text-xs text-amber-50">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-[0.08em]">Liquidity watch</span>
                  <Badge variant="outline" className="border-amber-700/60 bg-amber-900/40 text-[10px] text-amber-100">Action</Badge>
                </div>
                <p className="mt-2 text-amber-100">Tax payment $4,500 due in 14 days. Redirect 30% of incoming payouts to reserve to avoid breach.</p>
              </div>
              <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-50">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-[0.08em]">Yield sweep</span>
                  <Badge variant="outline" className="border-emerald-700/60 bg-emerald-900/40 text-[10px] text-emerald-100">Ready</Badge>
                </div>
                <p className="mt-2 text-emerald-100">Idle cash ${liquidCash.toLocaleString()} detected. Sweep 40% into treasuries ladder and 10% into BTC momentum pod.</p>
              </div>
              <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/40 p-3 text-xs text-cyan-50">
                <div className="flex items-center justify-between">
                  <span className="uppercase tracking-[0.08em]">FX hedge</span>
                  <Badge variant="outline" className="border-cyan-700/60 bg-cyan-900/40 text-[10px] text-cyan-100">Idea</Badge>
                </div>
                <p className="mt-2 text-cyan-100">EUR/USD softness. Consider 60-day collar around 1.08 to protect import exposure.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Command terminal */}
        <section className="rounded-2xl border border-slate-800/60 bg-black/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Operations deck</p>
              <h2 className="text-lg font-semibold text-white">Capital Terminal</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Wifi className="h-3 w-3" /> Secure uplink · Enterprise controls
            </div>
          </div>
          <div className="h-[620px] overflow-hidden rounded-xl border border-slate-800/60">
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center bg-[#050505]">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-cyan-500" />
                    <span className="text-[10px] tracking-[0.2em] text-cyan-700">Establishing secure uplink...</span>
                  </div>
                </div>
              }
            >
              <CapitalTerminal initialData={snapshot} />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
