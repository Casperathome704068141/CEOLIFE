
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col">
      <PageHeader
        title="Beno Assistant"
        description="Your AI Chief of Staff for finance, household, and wellness."
        actions={
          <div className="flex gap-2">
            <Button>New Briefing</Button>
            <Button variant="secondary">Create Rule</Button>
          </div>
        }
      />
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex-1 rounded-3xl border border-slate-900/60 bg-slate-950/80 p-4">
            <p className="text-center text-sm text-slate-400">
              Chat thread will be implemented here.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-900/60 bg-slate-950/80 p-4">
            <p className="text-center text-sm text-slate-400">
              Composer will be implemented here.
            </p>
          </div>
        </div>
        <div className="hidden rounded-3xl border border-slate-900/60 bg-slate-950/80 p-4 lg:block">
          <p className="text-center text-sm text-slate-400">
            Side panel will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}
