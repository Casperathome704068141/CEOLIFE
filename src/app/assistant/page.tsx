"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { AssistantProvider, useAssistantContext } from "@/lib/assistant/context";
import { ModeToggle } from "@/components/assistant/mode-toggle";
import { Thread } from "@/components/assistant/Thread";
import { Composer } from "@/components/assistant/Composer";
import { SidePanel } from "@/components/assistant/SidePanel";
import { useAssistant } from "@/lib/assistant/useAssistant";
import { NewBriefingDialog } from "@/components/assistant/Modals/NewBriefingDialog";
import { CreateRuleDrawer } from "@/components/assistant/Modals/CreateRuleDrawer";
import { ScheduleDrawer } from "@/components/assistant/Modals/ScheduleDrawer";
import { SimulateDrawer } from "@/components/assistant/Modals/SimulateDrawer";
import { NudgeDialog } from "@/components/assistant/Modals/NudgeDialog";
import { ImportDialog } from "@/components/assistant/Modals/ImportDialog";
import { AttachPicker } from "@/components/assistant/Modals/AttachPicker";
import { OpenInDrawer } from "@/components/assistant/Modals/OpenInDrawer";
import type { Action } from "@/lib/assistant/types";

export default function AssistantPage() {
  return (
    <AssistantProvider>
      <AssistantPageInner />
    </AssistantProvider>
  );
}

function AssistantPageInner() {
  const [input, setInput] = useState("");
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [openIn, setOpenIn] = useState<{ open: boolean; destination?: string; preview?: string }>({ open: false });
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const { mode, chips, attachments, clearAttachments } = useAssistantContext();
  const { messages, loading, sendMessage, executeAction, execLogs, injectMessage } = useAssistant();

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const activeChips = chips.filter((chip) => chip.active).map((chip) => chip.label);
    await sendMessage({
      content: input,
      mode,
      chips: activeChips,
      attachments: attachments.map((file) => ({ id: file.id, name: file.name, type: file.type })),
    });
    setInput("");
    clearAttachments();
  };

  const handleAction = async (_message: any, action: Action) => {
    setActiveAction(action);
    switch (action.type) {
      case "accept":
        await executeAction(action);
        break;
      case "schedule":
        setScheduleOpen(true);
        break;
      case "simulate":
        setSimulateOpen(true);
        break;
      case "nudge":
        setNudgeOpen(true);
        break;
      case "open":
        setOpenIn({
          open: true,
          destination: (action.payload?.destination as string) ?? "Finance",
          preview: (action.payload?.preview as string) ?? "Confirm navigation",
        });
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-transaction":
        setInput("/add txn ");
        break;
      case "scan-receipt":
        setAttachOpen(true);
        break;
      case "create-event":
        setScheduleOpen(true);
        break;
      case "record-payment":
        setInput("Record payment for Hydro bill");
        break;
      case "send-nudge":
        setNudgeOpen(true);
        break;
      case "Summarize anomalies (7d)":
      case "Draft evening brief":
      case "Plan payday routine":
        setInput(action);
        break;
      default:
        setInput(action);
    }
  };

  const runBriefing = async (type: string) => {
    try {
      const response = await fetch("/api/assistant/briefing/run", {
        method: "POST",
        body: JSON.stringify({ type, context: chips.filter((chip) => chip.active).map((chip) => chip.id) }),
      });
      const json = await response.json();
      injectMessage({ role: "assistant", kind: "briefing", sections: json.sections });
    } finally {
      setBriefingOpen(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col">
      <PageHeader
        title="Beno Assistant"
        description="Your AI Chief of Staff for finance, household, and wellness."
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={() => setBriefingOpen(true)} className="bg-gradient-to-r from-sky-500 to-blue-500">
              New Briefing
            </Button>
            <Button variant="secondary" onClick={() => setRuleOpen(true)}>
              Create Rule
            </Button>
            <div className="hidden lg:block">
              <ModeToggle />
            </div>
          </div>
        }
      />
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex-1 overflow-hidden rounded-3xl border border-slate-900/60 bg-slate-950/80">
            <Thread messages={messages} loading={loading} execLogs={execLogs} onAction={handleAction} />
          </div>
          <Composer value={input} onChange={setInput} onSubmit={handleSend} loading={loading} />
        </div>
        <div className="hidden lg:block">
          <SidePanel onQuickAction={handleQuickAction} />
        </div>
      </div>

      <NewBriefingDialog open={briefingOpen} onOpenChange={setBriefingOpen} onRun={runBriefing} />
      <CreateRuleDrawer open={ruleOpen} onOpenChange={setRuleOpen} onCreate={() => setRuleOpen(false)} />
      <ScheduleDrawer
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onSchedule={(payload) => {
          if (activeAction) {
            executeAction({
              ...activeAction,
              payload: { ...(activeAction.payload ?? {}), schedule: payload },
            });
          }
          setScheduleOpen(false);
        }}
      />
      <SimulateDrawer
        open={simulateOpen}
        onOpenChange={setSimulateOpen}
        context={input}
        onApply={(note) => {
          if (activeAction) {
            executeAction({
              ...activeAction,
              payload: { ...(activeAction.payload ?? {}), scenario: note },
            });
          }
          setSimulateOpen(false);
        }}
      />
      <NudgeDialog
        open={nudgeOpen}
        onOpenChange={setNudgeOpen}
        onSend={(payload) => {
          if (activeAction) {
            executeAction({
              ...activeAction,
              payload: { ...(activeAction.payload ?? {}), ...payload },
            });
          }
          setNudgeOpen(false);
        }}
      />
      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        payload={{
          type: "receipt",
          confidence: 0.93,
          proposedActions: [
            {
              label: "Create 3 transactions",
              tool: "transaction",
              payloadPreview: { total: 186.43, tags: ["household", "reimbursable"] },
            },
            {
              label: "Save to Vault + set expiry",
              tool: "vault",
              payloadPreview: { folder: "Receipts", expiresAt: "2024-12-01" },
            },
          ],
        }}
        onImport={(actions) => {
          actions.forEach((proposed) => {
            executeAction({
              id: proposed.label,
              label: proposed.label,
              type: "accept",
              payload: { tool: proposed.tool, data: proposed.payloadPreview },
            });
          });
          setImportOpen(false);
        }}
      />
      <AttachPicker open={attachOpen} onOpenChange={setAttachOpen} onSelect={() => setImportOpen(true)} />
      <OpenInDrawer
        open={openIn.open}
        onOpenChange={(open) => setOpenIn((prev) => ({ ...prev, open }))}
        destination={openIn.destination}
        preview={openIn.preview}
        onConfirm={() => setOpenIn((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
