"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useHousehold } from "@/lib/household/useHousehold";
import type { ShoppingItem } from "@/lib/household/types";
import { PriceTargetDialog } from "./PriceTargetDialog";
import { NudgeDialog } from "../NudgeDialog";

export function ShoppingList() {
  const {
    shoppingLists,
    addShoppingItem,
    toggleShoppingItem,
    setShoppingPriceTarget,
    sendShoppingList,
    members,
  } = useHousehold();
  const { toast } = useToast();

  const list = shoppingLists[0];
  const [form, setForm] = useState({ label: "", qty: "", priority: "med", recurring: false });
  const [priceDialogItem, setPriceDialogItem] = useState<ShoppingItem | null>(null);
  const [nudgeMember, setNudgeMember] = useState(members[0] ?? null);

  useEffect(() => {
    const handleAdd = () => {
      const input = document.getElementById("shopping-add-input");
      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    };
    window.addEventListener("household:add-shopping", handleAdd);
    return () => window.removeEventListener("household:add-shopping", handleAdd);
  }, []);

  const items = useMemo(() => list?.items ?? [], [list]);

  if (!list) {
    return (
      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Shopping list</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-400">No list yet.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-100">{list.name}</CardTitle>
            <p className="text-xs text-slate-500">Recurring essentials with price targets.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-2xl border-cyan-600/40 text-cyan-200"
              onClick={async () => {
                if (!members[0]) return;
                await sendShoppingList({ listId: list.id, channel: "whatsapp", to: members[0].phone ?? "" });
                toast({ title: "List sent", description: `Shared with ${members[0].name}` });
              }}
            >
              Send list
            </Button>
            <Button variant="ghost" className="rounded-2xl text-xs uppercase tracking-widest text-slate-500" onClick={() => setNudgeMember(members[0] ?? null)}>
              Promote to task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="grid gap-3 md:grid-cols-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await addShoppingItem({
                listId: list.id,
                label: form.label,
                qty: form.qty,
                priority: form.priority as ShoppingItem["priority"],
                recurring: form.recurring,
              });
              setForm({ label: "", qty: "", priority: "med", recurring: false });
            }}
          >
            <Input
              id="shopping-add-input"
              placeholder="Item"
              value={form.label}
              onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
              required
            />
            <Input placeholder="Qty" value={form.qty} onChange={(event) => setForm((prev) => ({ ...prev, qty: event.target.value }))} />
            <Input placeholder="Priority (low/med/high)" value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))} />
            <Button type="submit" className="rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400">
              Add item
            </Button>
          </form>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 rounded-2xl bg-slate-900/60 p-3 text-sm text-slate-200 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={item.isChecked}
                    onCheckedChange={async (checked) => {
                      await toggleShoppingItem({ listId: list.id, itemId: item.id, checked: Boolean(checked) });
                    }}
                  />
                  <div>
                    <p className="font-medium text-slate-100">{item.label}</p>
                    <p className="text-xs text-slate-500">
                      {item.qty ? `${item.qty} • ` : ""}Priority {item.priority}
                      {item.recurring ? " • Recurring" : ""}
                      {item.priceTarget ? ` • Target $${item.priceTarget}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.recurring ? <Badge variant="secondary" className="rounded-xl bg-cyan-500/20 text-xs text-cyan-200">Recurring</Badge> : null}
                  <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setPriceDialogItem(item)}>
                    Price target
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <PriceTargetDialog
        itemLabel={priceDialogItem?.label ?? ""}
        open={!!priceDialogItem}
        onOpenChange={(value) => !value && setPriceDialogItem(null)}
        onSave={async (price) => {
          if (!priceDialogItem) return;
          await setShoppingPriceTarget({ listId: list.id, itemId: priceDialogItem.id, priceTarget: price });
          toast({ title: "Price target updated", description: price ? `$${price.toFixed(2)}` : "Cleared" });
        }}
      />
      <NudgeDialog member={nudgeMember} open={!!nudgeMember} onOpenChange={(value) => !value && setNudgeMember(null)} />
    </div>
  );
}
