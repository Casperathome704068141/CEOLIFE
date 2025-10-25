'use client';

import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCollection, useUser } from "@/firebase";
import type { ShoppingListDoc } from "@/lib/schemas";
import { Check } from "lucide-react";

export default function ShoppingPage() {
  const { user } = useUser();
  const { data: shoppingLists, loading: shoppingListsLoading } = useCollection<ShoppingListDoc>('shoppingLists', {
    query: ['ownerId', '==', user?.uid],
    skip: !user?.uid,
  });

  const shoppingListItems = shoppingLists?.[0]?.items || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Shopping & essentials"
        description="Shared list with AI prioritization and settlement flows."
        actions={
          <>
            <PagePrimaryAction>Add item</PagePrimaryAction>
            <PageSecondaryAction>Split cost</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Household list</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {shoppingListsLoading ? (
            <p>Loading list...</p>
          ) : (
            shoppingListItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="text-xs text-slate-400">Qty: {item.qty}</p>
                </div>
                <Button size="sm" variant="ghost" className="rounded-2xl border border-slate-800">
                  <Check className="mr-2 h-4 w-4" />
                  Mark done
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
    
