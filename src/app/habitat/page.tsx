import { Suspense } from "react";
import Link from "next/link";
import { HabitatInterface } from "@/components/habitat/habitat-interface";
import { getAssetStatus, getInventoryAlerts } from "@/lib/api/habitat";
import { Button } from "@/components/ui/button";
import { Box, Home, ShieldCheck } from "lucide-react";

export default async function HabitatPage() {
  const [assets, inventory] = await Promise.all([
    getAssetStatus(),
    getInventoryAlerts(),
  ]);

  return (
    <div className="flex h-screen w-full flex-col bg-[#050505] text-slate-100 overflow-hidden font-mono">
      {/* HUD HEADER */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 uppercase text-[10px] tracking-widest font-bold"
            >
              <Home className="h-3 w-3" /> Mission Control
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Box className="h-3 w-3 text-emerald-500" />
            <span>FACILITY STATUS: ONLINE</span>
          </div>
        </div>

        {/* Asset Health Summary */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] text-slate-400">PM COMPLIANCE: 94%</span>
          </div>
        </div>
      </header>

      {/* THE FACILITY MANAGER */}
      <main className="flex-1 relative overflow-hidden">
        <Suspense fallback={<div className="p-10 text-center text-xs animate-pulse">Loading Facility Schematics...</div>}>
          <HabitatInterface initialAssets={assets} initialInventory={inventory} />
        </Suspense>
      </main>
    </div>
  );
}
