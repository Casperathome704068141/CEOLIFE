"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Sparkles, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { shoppingList as initialShoppingList } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ShoppingList() {
  const [items, setItems] = React.useState(initialShoppingList);

  const handleCheck = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ShoppingCart className="h-4 w-4" />
          Shopping & Essentials
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pr-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <Checkbox
              id={`item-${item.id}`}
              checked={item.checked}
              onCheckedChange={() => handleCheck(item.id)}
            />
            <label
              htmlFor={`item-${item.id}`}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                item.checked && "text-muted-foreground line-through"
              )}
            >
              {item.name}
            </label>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 border-t pt-4">
        <Button size="sm" variant="outline" className="w-full">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            AI Suggest Items
        </Button>
        <Button size="sm" variant="ghost" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
        </Button>
      </CardFooter>
    </Card>
  );
}
