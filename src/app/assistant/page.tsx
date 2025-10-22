import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const messages = [
  { role: "system", content: "Morning briefing ready with cashflow insights." },
  { role: "user", content: "Summarize rent ledger anomalies." },
  { role: "assistant", content: "Two anomalies detected: double payment in August and late fee reversed." },
];

export default function AssistantPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Beno assistant"
        description="Chat with your chief of staff, convert insights into tasks, rules, or simulations."
        actions={
          <>
            <PagePrimaryAction>New briefing</PagePrimaryAction>
            <PageSecondaryAction>Create rule from chat</PageSecondaryAction>
          </>
        }
      />

      <Card className="rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-2xl border border-slate-900/60 bg-slate-900/60 p-4 text-sm ${
                message.role === "assistant" ? "text-cyan-200" : "text-slate-200"
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">{message.role}</p>
              <p>{message.content}</p>
              {message.role === "assistant" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" className="rounded-2xl">
                    Accept
                  </Button>
                  <Button size="sm" variant="secondary" className="rounded-2xl">
                    Schedule
                  </Button>
                  <Button size="sm" variant="secondary" className="rounded-2xl">
                    Simulate
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
