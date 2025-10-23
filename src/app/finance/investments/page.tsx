import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { marketWatchlist } from "@/lib/data";

export default function InvestmentsPage() {
  const stockAssets = marketWatchlist.filter(asset => asset.type === "stock");
  const cryptoAssets = marketWatchlist.filter(asset => asset.type === "crypto");

  const stockAllocation = stockAssets.reduce((sum, asset) => sum + asset.allocation, 0);
  const cryptoAllocation = cryptoAssets.reduce((sum, asset) => sum + asset.allocation, 0);
  const totalTracked = stockAllocation + cryptoAllocation;

  const stockPercent = totalTracked === 0 ? 0 : Math.round((stockAllocation / totalTracked) * 100);
  const cryptoPercent = totalTracked === 0 ? 0 : Math.round((cryptoAllocation / totalTracked) * 100);

  const topMovers = [...marketWatchlist]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 3);

  const learningPrompts = [
    "Skim AI summary of Apple and Microsoft earnings to understand the tech sector narrative.",
    "Track Bitcoin’s on-chain activity and upcoming catalysts before committing new cash.",
    "Use Beno simulations to test how crypto volatility would impact household liquidity.",
  ];

  const formatAssetPrice = (price: number, currency = "USD", type: "stock" | "crypto") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: type === "crypto" ? 0 : 2,
    }).format(price);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Investments & markets"
        description="See the stocks and crypto you’re tracking, keep allocations balanced, and flag learning moments."
        actions={
          <>
            <PagePrimaryAction>Add to watchlist</PagePrimaryAction>
            <PageSecondaryAction>Run scenario</PageSecondaryAction>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 xl:col-span-4 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Allocation snapshot</CardTitle>
            <p className="text-xs text-slate-400">Quick ratio of your tracked exposure across equities and crypto.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Stocks</span>
                <span>{stockPercent}%</span>
              </div>
              <Progress value={stockPercent} className="mt-3 h-2 rounded-full bg-slate-800" />
              <p className="mt-3 text-xs text-slate-400">
                Keep equities as the stabiliser while you evaluate crypto signals.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Crypto</span>
                <span>{cryptoPercent}%</span>
              </div>
              <Progress value={cryptoPercent} className="mt-3 h-2 rounded-full bg-slate-800" />
              <p className="mt-3 text-xs text-slate-400">
                Beno recommends keeping crypto exposure below 35% while you build experience.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4 text-xs text-slate-400">
              <p className="font-medium text-slate-200">Top movers today</p>
              <ul className="mt-2 space-y-2">
                {topMovers.map(asset => (
                  <li key={asset.symbol} className="flex items-center justify-between">
                    <span className="text-slate-300">{asset.symbol}</span>
                    <span className={asset.change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {asset.change >= 0 ? "+" : ""}
                      {asset.changePercent.toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-12 xl:col-span-8 rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Watchlist</CardTitle>
            <p className="text-xs text-slate-400">Live tickers you’re following to sharpen your finance intuition.</p>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs uppercase tracking-wide text-slate-400">
                  <TableHead className="text-slate-300">Symbol</TableHead>
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Type</TableHead>
                  <TableHead className="text-slate-300">Price</TableHead>
                  <TableHead className="text-slate-300">Change</TableHead>
                  <TableHead className="text-slate-300">Allocation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketWatchlist.map(asset => {
                  const changeClass = asset.change >= 0 ? "text-emerald-400" : "text-rose-400";
                  return (
                    <TableRow key={asset.symbol} className="text-sm text-slate-200">
                      <TableCell className="font-medium text-white">{asset.symbol}</TableCell>
                      <TableCell className="text-xs text-slate-400">{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-800 text-slate-300">
                          {asset.type === "stock" ? "Stock" : "Crypto"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatAssetPrice(asset.price, asset.currency, asset.type)}</TableCell>
                      <TableCell className={changeClass}>
                        {asset.change >= 0 ? "+" : ""}
                        {asset.change.toFixed(asset.type === "crypto" ? 0 : 2)} ({asset.changePercent.toFixed(2)}%)
                      </TableCell>
                      <TableCell>{(asset.allocation * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Learning agenda</CardTitle>
          <p className="text-xs text-slate-400">Blend market research with household priorities so everyone stays informed.</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <ul className="space-y-2">
            {learningPrompts.map(prompt => (
              <li key={prompt} className="rounded-2xl border border-slate-900/60 bg-slate-900/40 p-4">
                {prompt}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
