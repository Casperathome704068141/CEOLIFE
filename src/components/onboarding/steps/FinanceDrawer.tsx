"use client";

import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineTable } from "../common/InlineTable";
import { useOnboardingStore } from "@/lib/onboarding/state";
import { persistSetup, requestPreview } from "@/lib/onboarding/client";
import { useToast } from "@/hooks/use-toast";

interface FinanceDrawerProps {
  open: boolean;
  onClose: () => void;
}

type IncomeForm = {
  name: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly";
  nextDate: string;
};

type BillForm = {
  name: string;
  amount: number;
  dueDay: number;
  autopay: boolean;
  tag?: string;
};

type BudgetRow = {
  category: string;
  percent: number;
};

const frequencyOptions: IncomeForm["frequency"][] = ["weekly", "biweekly", "monthly"];

export function FinanceDrawer({ open, onClose }: FinanceDrawerProps) {
  const { toast } = useToast();
  const setup = useOnboardingStore((state) => state.setup);
  const updateData = useOnboardingStore((state) => state.updateData);
  const setPreview = useOnboardingStore((state) => state.setPreview);

  const [currency, setCurrency] = useState("CAD");
  const [income, setIncome] = useState<IncomeForm[]>([]);
  const [bills, setBills] = useState<BillForm[]>([]);
  const [budget, setBudget] = useState<BudgetRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [localPreview, setLocalPreview] = useState<{ forecast: number[]; bills: BillForm[] }>({
    forecast: [],
    bills: [],
  });

  useEffect(() => {
    if (!open) return;
    const finance = setup.data.finance;
    setCurrency(finance?.currency ?? "CAD");
    setIncome(finance?.income ?? []);
    setBills(finance?.bills ?? []);
    setBudget(finance?.budgetTemplate ?? []);
  }, [open, setup.data.finance]);

  const createIncome = (): IncomeForm => ({
    name: "",
    amount: 0,
    frequency: "monthly",
    nextDate: new Date().toISOString().slice(0, 10),
  });

  const createBill = (): BillForm => ({
    name: "",
    amount: 0,
    dueDay: 1,
    autopay: false,
    tag: "",
  });

  const createBudget = (): BudgetRow => ({
    category: "",
    percent: 10,
  });

  const updateIncome = (index: number, patch: Partial<IncomeForm>) => {
    setIncome((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateBill = (index: number, patch: Partial<BillForm>) => {
    setBills((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const updateBudget = (index: number, patch: Partial<BudgetRow>) => {
    setBudget((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const financePayload = {
        currency,
        income: income.filter((item) => item.name.trim().length),
        bills: bills.filter((item) => item.name.trim().length),
        budgetTemplate: budget.filter((row) => row.category.trim().length),
      };
      updateData("finance", { finance: financePayload } as any);
      const latest = useOnboardingStore.getState().setup;
      const response = await persistSetup(latest, false);
      const preview = await requestPreview(response.setup);
      setPreview({
        readiness: preview.readiness,
        financeForecast: preview.finance?.forecast ?? [],
        upcomingBills: preview.finance?.bills ?? [],
        care: preview.care ?? [],
        rules: preview.rules ?? [],
      });
      setLocalPreview({
        forecast: preview.finance?.forecast ?? [],
        bills: (preview.finance?.bills ?? []).map((bill) => ({
          name: bill.name,
          amount: bill.amount,
          dueDay: parseInt(bill.due.replace(/\D+/g, "")) || 1,
          autopay: false,
          tag: bill.name,
        })),
      });
      toast({ title: "Finance saved", description: "Income and bills captured." });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [bills, budget, currency, income, onClose, setPreview, toast, updateData]);

  useEffect(() => {
    const listener = () => {
      if (open) {
        handleSave();
      }
    };
    window.addEventListener("onboarding-save" as any, listener);
    return () => window.removeEventListener("onboarding-save" as any, listener);
  }, [handleSave, open]);

  const budgetSum = budget.reduce((acc, row) => acc + Number(row.percent || 0), 0);

  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Finance & Bills</SheetTitle>
          <SheetDescription>Enter income streams, recurring bills and budgets.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Currency</h3>
            <Input value={currency} onChange={(event) => setCurrency(event.target.value)} className="w-32" />
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Income</h3>
            <InlineTable<IncomeForm>
              data={income}
              onAdd={() => setIncome((prev) => [...prev, createIncome()])}
              onRemove={(index) => setIncome((prev) => prev.filter((_, idx) => idx !== index))}
              columns={[
                {
                  key: "name",
                  label: "Name",
                  render: (item, index) => (
                    <Input
                      value={item.name}
                      onChange={(event) => updateIncome(index, { name: event.target.value })}
                    />
                  ),
                },
                {
                  key: "amount",
                  label: "Amount",
                  render: (item, index) => (
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(event) => updateIncome(index, { amount: Number(event.target.value) })}
                    />
                  ),
                },
                {
                  key: "frequency",
                  label: "Frequency",
                  render: (item, index) => (
                    <select
                      className="w-full rounded border border-border/60 bg-background px-2 py-1 text-sm"
                      value={item.frequency}
                      onChange={(event) =>
                        updateIncome(index, { frequency: event.target.value as IncomeForm["frequency"] })
                      }
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ),
                },
                {
                  key: "nextDate",
                  label: "Next date",
                  render: (item, index) => (
                    <Input
                      type="date"
                      value={item.nextDate}
                      onChange={(event) => updateIncome(index, { nextDate: event.target.value })}
                    />
                  ),
                },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Bills</h3>
            <InlineTable<BillForm>
              data={bills}
              onAdd={() => setBills((prev) => [...prev, createBill()])}
              onRemove={(index) => setBills((prev) => prev.filter((_, idx) => idx !== index))}
              columns={[
                {
                  key: "name",
                  label: "Name",
                  render: (item, index) => (
                    <Input
                      value={item.name}
                      onChange={(event) => updateBill(index, { name: event.target.value })}
                    />
                  ),
                },
                {
                  key: "amount",
                  label: "Amount",
                  render: (item, index) => (
                    <Input
                      type="number"
                      value={item.amount}
                      onChange={(event) => updateBill(index, { amount: Number(event.target.value) })}
                    />
                  ),
                },
                {
                  key: "dueDay",
                  label: "Due day",
                  render: (item, index) => (
                    <Input
                      type="number"
                      value={item.dueDay}
                      onChange={(event) => updateBill(index, { dueDay: Number(event.target.value) })}
                    />
                  ),
                },
                {
                  key: "autopay",
                  label: "Autopay",
                  render: (item, index) => (
                    <select
                      className="w-full rounded border border-border/60 bg-background px-2 py-1 text-sm"
                      value={item.autopay ? "true" : "false"}
                      onChange={(event) => updateBill(index, { autopay: event.target.value === "true" })}
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  ),
                },
                {
                  key: "tag",
                  label: "Tag",
                  render: (item, index) => (
                    <Input
                      value={item.tag ?? ""}
                      onChange={(event) => updateBill(index, { tag: event.target.value })}
                    />
                  ),
                },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Budget template</h3>
            <InlineTable<BudgetRow>
              data={budget}
              onAdd={() => setBudget((prev) => [...prev, createBudget()])}
              onRemove={(index) => setBudget((prev) => prev.filter((_, idx) => idx !== index))}
              columns={[
                {
                  key: "category",
                  label: "Category",
                  render: (item, index) => (
                    <Input
                      value={item.category}
                      onChange={(event) => updateBudget(index, { category: event.target.value })}
                    />
                  ),
                },
                {
                  key: "percent",
                  label: "%",
                  render: (item, index) => (
                    <Input
                      type="number"
                      value={item.percent}
                      onChange={(event) => updateBudget(index, { percent: Number(event.target.value) })}
                    />
                  ),
                },
              ]}
            >
              <div className="text-xs text-muted-foreground">Total {budgetSum}%</div>
            </InlineTable>
            {budgetSum > 100 && (
              <p className="text-sm text-destructive">Budget allocation exceeds 100%.</p>
            )}
          </section>
          {localPreview.forecast.length > 0 && (
            <section className="rounded-lg border border-border/70 p-4 text-sm">
              <h3 className="font-semibold">Preview</h3>
              <p className="mt-2 text-muted-foreground">
                First 3 months cashflow: {localPreview.forecast.map((value) => value.toFixed(0)).join(", ")}
              </p>
            </section>
          )}
        </div>
        <SheetFooter className="mt-8">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Discard
          </Button>
          <Button onClick={handleSave} disabled={saving || budgetSum > 100}>
            Save & close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
