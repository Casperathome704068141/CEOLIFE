"use client";

import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Asset } from "@/lib/household/types";

interface AssetEditorProps {
  asset?: Asset | null;
  onSubmit: (payload: Partial<Asset> & { name: string; category: Asset["category"]; condition: Asset["condition"] }) => Promise<void>;
  onClose: () => void;
}

export function AssetEditor({ asset, onSubmit, onClose }: AssetEditorProps) {
  const [form, setForm] = useState({
    name: asset?.name ?? "",
    category: asset?.category ?? "appliance",
    condition: asset?.condition ?? "good",
    purchaseDate: asset?.purchaseDate?.slice(0, 10) ?? "",
    purchasePrice: asset?.purchasePrice?.toString() ?? "",
    serial: asset?.serial ?? "",
  });

  return (
    <DialogContent className="max-w-lg rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>{asset ? "Edit asset" : "Add asset"}</DialogTitle>
      </DialogHeader>
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit({
            id: asset?.id,
            name: form.name,
            category: form.category as Asset["category"],
            condition: form.condition as Asset["condition"],
            purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : undefined,
            purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : undefined,
            serial: form.serial,
          });
          onClose();
        }}
      >
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appliance">Appliance</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(value) => setForm((prev) => ({ ...prev, condition: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Purchase date</Label>
            <Input type="date" value={form.purchaseDate} onChange={(event) => setForm((prev) => ({ ...prev, purchaseDate: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input value={form.purchasePrice} onChange={(event) => setForm((prev) => ({ ...prev, purchasePrice: event.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Serial</Label>
          <Input value={form.serial} onChange={(event) => setForm((prev) => ({ ...prev, serial: event.target.value }))} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1 rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400">
            Save
          </Button>
          <Button type="button" variant="ghost" className="flex-1 rounded-2xl" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
