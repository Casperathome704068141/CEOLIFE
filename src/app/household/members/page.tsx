"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, PagePrimaryAction, PageSecondaryAction } from "@/components/layout/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/household/MemberCard";
import { NudgeDialog } from "@/components/household/NudgeDialog";
import { useHousehold } from "@/lib/household/useHousehold";
import type { Member } from "@/lib/household/types";

export default function MembersPage() {
  const { members, careProfiles, addMember, updateMemberRole } = useHousehold();
  const [nudgeTarget, setNudgeTarget] = useState<Member | null>(null);
  const [open, setOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Member | null>(null);

  useEffect(() => {
    const handleAdd = () => setOpen(true);
    const handleAssign = () => setAssignTarget(members[0] ?? null);
    const handleNudge = () => setNudgeTarget(members[0] ?? null);
    window.addEventListener("household:add-member", handleAdd);
    window.addEventListener("household:assign-role", handleAssign);
    window.addEventListener("household:nudge-member", handleNudge);
    return () => {
      window.removeEventListener("household:add-member", handleAdd);
      window.removeEventListener("household:assign-role", handleAssign);
      window.removeEventListener("household:nudge-member", handleNudge);
    };
  }, [members]);

  const sortedMembers = useMemo(() => [...members].sort((a, b) => a.name.localeCompare(b.name)), [members]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Household members"
        description="Role-based summaries with quick nudges, care linkages, and relationship context."
        actions={
          <div className="flex gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <PagePrimaryAction>Add member</PagePrimaryAction>
              </DialogTrigger>
              <MemberEditor onSubmit={async (payload) => { await addMember(payload); setOpen(false); }} />
            </Dialog>
            <Dialog open={!!assignTarget} onOpenChange={(value) => !value && setAssignTarget(null)}>
              <DialogTrigger asChild>
                <PageSecondaryAction>Assign role</PageSecondaryAction>
              </DialogTrigger>
              {assignTarget ? (
                <RoleDialog member={assignTarget} onAssign={async (role) => { await updateMemberRole(assignTarget.id, role); setAssignTarget(null); }} />
              ) : (
                <RolePicker members={members} onSelect={setAssignTarget} />
              )}
            </Dialog>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            careProfiles={careProfiles}
            onNudge={setNudgeTarget}
            onEdit={() => setAssignTarget(member)}
          />
        ))}
      </div>
      <NudgeDialog member={nudgeTarget} open={!!nudgeTarget} onOpenChange={(value) => !value && setNudgeTarget(null)} />
    </div>
  );
}

function MemberEditor({ onSubmit }: { onSubmit: (payload: { name: string; relation: Member["relation"]; phone?: string }) => Promise<void> }) {
  const [form, setForm] = useState<{ name: string; relation: Member["relation"] | ""; phone?: string }>({ name: "", relation: "" });
  return (
    <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>Add household member</DialogTitle>
      </DialogHeader>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (!form.name || !form.relation) return;
          await onSubmit({ name: form.name, relation: form.relation, phone: form.phone });
          setForm({ name: "", relation: "" });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="E.g. Beno" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <Label>Relation</Label>
          <Select value={form.relation} onValueChange={(value: Member["relation"]) => setForm((prev) => ({ ...prev, relation: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brother">Brother</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full rounded-2xl bg-cyan-500/80 text-slate-950 hover:bg-cyan-400">
          Save member
        </Button>
      </form>
    </DialogContent>
  );
}

function RolePicker({ members, onSelect }: { members: Member[]; onSelect: (member: Member) => void }) {
  return (
    <DialogContent className="max-w-md rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>Select member</DialogTitle>
      </DialogHeader>
      <div className="space-y-2">
        {members.map((member) => (
          <Button key={member.id} variant="ghost" className="w-full justify-start rounded-2xl text-left text-slate-200 hover:bg-slate-900/80" onClick={() => onSelect(member)}>
            {member.name}
          </Button>
        ))}
      </div>
    </DialogContent>
  );
}

function RoleDialog({ member, onAssign }: { member: Member; onAssign: (role: string) => Promise<void> }) {
  return (
    <DialogContent className="max-w-sm rounded-3xl border border-slate-800 bg-slate-950">
      <DialogHeader>
        <DialogTitle>Assign role to {member.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        {["Admin", "Family", "Guest"].map((role) => (
          <Button key={role} variant="ghost" className="w-full justify-between rounded-2xl text-left text-slate-200 hover:bg-slate-900/70" onClick={async () => onAssign(role)}>
            <span>{role}</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">label</span>
          </Button>
        ))}
      </div>
    </DialogContent>
  );
}
