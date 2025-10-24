"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface RulePreset {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  params: Record<string, string | number>;
}

interface RuleMiniBuilderProps {
  presets: RulePreset[];
  onChange: (presets: RulePreset[]) => void;
}

export function RuleMiniBuilder({ presets, onChange }: RuleMiniBuilderProps) {
  const [local, setLocal] = useState(presets);

  const updatePreset = (index: number, next: Partial<RulePreset>) => {
    const updated = [...local];
    updated[index] = { ...updated[index], ...next };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {local.map((preset, index) => (
        <div key={preset.id} className="rounded-lg border border-border/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{preset.title}</p>
              <p className="text-xs text-muted-foreground">{preset.description}</p>
            </div>
            <Switch
              checked={preset.enabled}
              onCheckedChange={(value) => updatePreset(index, { enabled: value })}
            />
          </div>
          {preset.enabled && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {Object.entries(preset.params).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs uppercase text-muted-foreground">{key}</Label>
                  <Input
                    value={value as string | number}
                    onChange={(event) =>
                      updatePreset(index, {
                        params: {
                          ...preset.params,
                          [key]: event.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
