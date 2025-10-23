"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmergencyCardProps {
  profileName: string;
  emergencyContact?: string;
  onShare: () => void;
}

export function EmergencyCard({ profileName, emergencyContact, onShare }: EmergencyCardProps) {
  return (
    <Card className="rounded-3xl border border-rose-500/40 bg-rose-500/10">
      <CardHeader>
        <CardTitle className="text-sm text-rose-200">Emergency card</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-rose-100">
        <p>
          Downloadable PDF with conditions, allergies, meds, and contacts for <span className="font-semibold">{profileName}</span>.
        </p>
        <p className="text-xs text-rose-200/80">Emergency contact: {emergencyContact ?? "Not set"}</p>
        <Button variant="secondary" className="rounded-2xl bg-rose-500/40 text-rose-50 hover:bg-rose-500/60" onClick={onShare}>
          Share via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
