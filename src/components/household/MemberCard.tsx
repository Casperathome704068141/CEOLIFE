"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CareProfile, Member } from "@/lib/household/types";

interface MemberCardProps {
  member: Member;
  careProfiles: CareProfile[];
  onNudge: (member: Member) => void;
  onEdit?: (member: Member) => void;
}

export const MemberCard = memo(function MemberCard({ member, careProfiles, onNudge, onEdit }: MemberCardProps) {
  const profileCount = careProfiles.filter((profile) => profile.memberId === member.id).length;
  return (
    <Card className="group relative h-full rounded-3xl border border-slate-900/60 bg-slate-950/80 shadow-2xl transition hover:border-slate-700/80">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg text-slate-50">{member.name}</CardTitle>
          <p className="text-xs uppercase tracking-wider text-slate-500">{member.roleLabel ?? member.relation}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onEdit?.(member)} className="rounded-full text-slate-500 hover:text-slate-100">
          <span className="sr-only">Edit member</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-3.243.865.865-3.243a4.5 4.5 0 011.13-1.897L16.862 4.487z" />
          </svg>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-300">
        <div className="grid gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Contact</p>
            <p className="font-medium text-slate-200">{member.phone ?? "No phone on file"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl bg-slate-800/70 text-xs text-slate-200">
              Nudges ready
            </Badge>
            <Badge variant="secondary" className="rounded-xl bg-cyan-900/40 text-xs text-cyan-200">
              Care profiles • {profileCount}
            </Badge>
          </div>
          {member.notes ? (
            <p className="rounded-2xl bg-slate-900/60 p-3 text-xs text-slate-400">{member.notes}</p>
          ) : null}
        </div>
        <Button onClick={() => onNudge(member)} className="w-full rounded-2xl bg-cyan-500/80 text-slate-900 hover:bg-cyan-400">
          Nudge
        </Button>
      </CardContent>
    </Card>
  );
});
