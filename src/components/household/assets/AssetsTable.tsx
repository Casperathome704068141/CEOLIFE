"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useHousehold } from "@/lib/household/useHousehold";
import type { Asset, Member } from "@/lib/household/types";
import { AssetEditor } from "./AssetEditor";
import { WarrantyDialog } from "./WarrantyDialog";
import { MaintenanceScheduleDrawer } from "./MaintenanceScheduleDrawer";
import { NudgeDialog } from "../NudgeDialog";

export function AssetsTable() {
  const {
    assets,
    members,
    addAsset,
    setAssetWarranty,
    scheduleAssetMaintenance,
    markAssetServiced,
  } = useHousehold();
  const { toast } = useToast();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [detailsAsset, setDetailsAsset] = useState<Asset | null>(null);
  const [warrantyAsset, setWarrantyAsset] = useState<Asset | null>(null);
  const [maintenanceAsset, setMaintenanceAsset] = useState<Asset | null>(null);
  const [nudgeMember, setNudgeMember] = useState<Member | null>(null);

  const sortedAssets = useMemo(() => [...assets].sort((a, b) => a.name.localeCompare(b.name)), [assets]);

  useEffect(() => {
    const handleAdd = () => {
      setEditingAsset(null);
      setEditorOpen(true);
    };
    window.addEventListener("household:add-asset", handleAdd);
    return () => window.removeEventListener("household:add-asset", handleAdd);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-slate-100">Assets & equipment</p>
          <p className="text-sm text-slate-400">Track warranties, receipts, and upkeep without leaving the page.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-2xl border-slate-700" onClick={() => setEditorOpen(true)}>
            Add asset
          </Button>
          <Button variant="ghost" className="rounded-2xl text-xs uppercase tracking-widest text-slate-400">
            Bulk actions
          </Button>
          <Button variant="ghost" className="rounded-2xl text-xs uppercase tracking-widest text-slate-400">
            Filters
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-900/60 bg-slate-950/80">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800">
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>Next maintenance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAssets.map((asset) => (
              <TableRow key={asset.id} className="border-slate-900/50">
                <TableCell className="font-medium text-slate-100">{asset.name}</TableCell>
                <TableCell className="text-slate-400">{asset.category}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="rounded-xl bg-slate-800/60 capitalize text-xs text-slate-200">
                    {asset.condition}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400">
                  {asset.warrantyEnd ? `Exp. ${new Date(asset.warrantyEnd).toLocaleDateString()}` : "Add"}
                </TableCell>
                <TableCell className="text-slate-400">
                  {asset.maintenance?.next
                    ? formatDistanceToNow(new Date(asset.maintenance.next), { addSuffix: true })
                    : "Schedule"}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setDetailsAsset(asset)}>
                    Open
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setWarrantyAsset(asset)}>
                    Warranty
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setMaintenanceAsset(asset)}>
                    Maintenance
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => setNudgeMember(members[0] ?? null)}
                  >
                    Nudge
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {(editorOpen || editingAsset) && (
        <AssetEditor
          asset={editingAsset}
          onSubmit={async (payload) => {
            await addAsset(payload);
            toast({ title: editingAsset ? "Asset updated" : "Asset added", description: payload.name });
            setEditingAsset(null);
            setEditorOpen(false);
          }}
          onClose={() => {
            setEditingAsset(null);
            setEditorOpen(false);
          }}
        />
      )}

      <WarrantyDialog
        asset={warrantyAsset}
        open={!!warrantyAsset}
        onOpenChange={(value) => !value && setWarrantyAsset(null)}
        onSave={async (payload) => {
          await setAssetWarranty(payload.assetId, payload.warrantyEnd, payload.reminderDays);
          toast({ title: "Warranty updated", description: warrantyAsset?.name });
        }}
      />

      <MaintenanceScheduleDrawer
        asset={maintenanceAsset}
        open={!!maintenanceAsset}
        onOpenChange={(value) => !value && setMaintenanceAsset(null)}
        onSave={async (payload) => {
          await scheduleAssetMaintenance(payload);
          toast({ title: "Maintenance scheduled", description: maintenanceAsset?.name });
        }}
        onMarkServiced={async (payload) => {
          await markAssetServiced(payload);
          toast({ title: "Marked serviced", description: maintenanceAsset?.name });
        }}
      />

      <Dialog open={!!detailsAsset} onOpenChange={(value) => !value && setDetailsAsset(null)}>
        <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950 text-slate-100">
          <DialogHeader>
            <DialogTitle>{detailsAsset?.name}</DialogTitle>
          </DialogHeader>
          {detailsAsset ? (
            <div className="space-y-2 text-sm text-slate-300">
              <p>Category: {detailsAsset.category}</p>
              <p>Condition: {detailsAsset.condition}</p>
              <p>Purchase: {detailsAsset.purchaseDate ? new Date(detailsAsset.purchaseDate).toLocaleDateString() : "—"}</p>
              <p>Serial: {detailsAsset.serial ?? "—"}</p>
              <p>Warranty: {detailsAsset.warrantyEnd ? new Date(detailsAsset.warrantyEnd).toLocaleDateString() : "Not set"}</p>
              <p>Maintenance cadence: {detailsAsset.maintenance?.cadenceDays ?? "—"} days</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <NudgeDialog member={nudgeMember} open={!!nudgeMember} onOpenChange={(value) => !value && setNudgeMember(null)} />
    </div>
  );
}
