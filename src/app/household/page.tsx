'use client';

import { MembersGrid } from "@/components/household/MembersGrid";
import { CareProfiles } from "@/components/household/care/CareProfiles";
import { AssetsTable } from "@/components/household/assets/AssetsTable";
import { ApartmentOverview } from "@/components/household/apartment/ApartmentOverview";
import { ShoppingList } from "@/components/household/shopping/ShoppingList";
import { SharedLedger } from "@/components/household/split/SharedLedger";
import { HouseholdTabs, type HouseholdTabItem } from "@/components/household/Tabs";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { HouseholdProvider, useHousehold } from "@/lib/household/useHousehold";

function HouseholdPageContent() {
  const { setActiveTab } = useHousehold();

  const tabs: HouseholdTabItem[] = [
    {
      id: "members",
      label: "Members",
      shortcut: "M",
      content: <MembersGrid />,
      onAdd: () => window.dispatchEvent(new Event("household:add-member")),
      onNudge: () => window.dispatchEvent(new Event("household:nudge-member")),
      onFilter: () => setActiveTab("members"),
    },
    {
      id: "care",
      label: "Care",
      shortcut: "C",
      content: <CareProfiles />,
      onAdd: () => window.dispatchEvent(new Event("household:add-medication")),
      onNudge: () => window.dispatchEvent(new Event("household:nudge-care")),
    },
    {
      id: "assets",
      label: "Assets",
      shortcut: "A",
      content: <AssetsTable />,
      onAdd: () => window.dispatchEvent(new Event("household:add-asset")),
    },
    {
      id: "apartment",
      label: "Apartment",
      shortcut: "P",
      content: <ApartmentOverview />,
      onAdd: () => window.dispatchEvent(new Event("household:add-ticket")),
    },
    {
      id: "shopping",
      label: "Shopping",
      shortcut: "H",
      content: <ShoppingList />,
      onAdd: () => window.dispatchEvent(new Event("household:add-shopping")),
    },
    {
      id: "split",
      label: "Split",
      shortcut: "S",
      content: <SharedLedger />,
      onAdd: () => window.dispatchEvent(new Event("household:add-ledger")),
    },
  ];

  return (
    <div className="space-y-8 px-4 py-8">
      <PageHeader
        title="Household command"
        description="Coordinate members, care, assets, and shared finances without leaving this workspace."
        actions={
          <>
            <Button
              onClick={() => window.dispatchEvent(new Event("household:add-member"))}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-6 font-medium text-white shadow-xl shadow-cyan-900/40 transition hover:shadow-2xl focus-visible:ring-cyan-400"
            >
              <span className="relative z-10">Add member</span>
              <span className="absolute inset-0 rounded-2xl bg-white/10 mix-blend-overlay" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.dispatchEvent(new Event("household:assign-role"))}
              className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-200 backdrop-blur transition hover:bg-slate-800"
            >
              Assign role
            </Button>
          </>
        }
      />
      <HouseholdTabs items={tabs} />
    </div>
  );
}

export default function HouseholdPage() {
  return (
    <HouseholdProvider>
      <HouseholdPageContent />
    </HouseholdProvider>
  );
}
