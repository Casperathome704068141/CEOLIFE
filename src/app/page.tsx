import { NetWorthCard } from "@/components/dashboard/net-worth-card";
import { UpcomingBills } from "@/components/dashboard/upcoming-bills";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { AiConcierge } from "@/components/dashboard/ai-concierge";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { SavingsGoals } from "@/components/dashboard/savings-goals";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { ShoppingList } from "@/components/dashboard/shopping-list";
import { AiSimulation } from "@/components/dashboard/ai-simulation";

export default function Home() {
  return (
    <div className="p-4 sm:p-6 md:p-8 grid auto-rows-max grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-6 xl:col-span-2">
        <NetWorthCard />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-3">
        <UpcomingBills />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-7 xl:col-span-4">
        <TodaySchedule />
      </div>
      <div className="col-span-12 lg:col-span-5 xl:col-span-3">
        <AiConcierge />
      </div>
      <div className="col-span-12 xl:col-span-7">
        <CashflowChart />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <SavingsGoals />
      </div>
      <div className="col-span-12 lg:col-span-6 xl:col-span-5">
        <RecentDocuments />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-3">
        <ShoppingList />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-12 xl:col-span-4">
        <AiSimulation />
      </div>
    </div>
  );
}
