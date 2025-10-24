"use client";

import { PersonSummary } from "@/lib/graph/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const channelMap: Record<string, string> = {
  sms: "SMS",
  email: "Email",
  phone: "Phone",
  portal: "Portal",
  push: "Push",
  whatsapp: "WhatsApp",
};

type Props = {
  people: PersonSummary[];
  onNudge?: (person: PersonSummary) => void;
};

export function PeopleLens({ people, onNudge }: Props) {
  return (
    <div className="space-y-3">
      {people.map(person => (
        <div key={person.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{person.name}</p>
              <p className="text-xs text-slate-400">{person.role}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {person.reachableVia.map(channel => (
                <Badge key={channel} variant="outline" className="border-slate-700 text-xs text-slate-200">
                  {channelMap[channel] ?? channel}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Preferred: {channelMap[person.preferredChannel ?? ""] ?? person.preferredChannel ?? "—"}
            </p>
            {onNudge && (
              <Button
                size="sm"
                variant="outline"
                className="border-cyan-500/40 text-xs text-cyan-200 hover:bg-cyan-500/10"
                onClick={() => onNudge(person)}
              >
                Nudge
              </Button>
            )}
          </div>
        </div>
      ))}
      {people.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-400">
          No linked people.
        </div>
      )}
    </div>
  );
}

