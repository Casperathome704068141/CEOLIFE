"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OAuthTileProps {
  name: string;
  description: string;
  connected?: boolean;
  onConnect?: () => Promise<void> | void;
  onDisconnect?: () => Promise<void> | void;
}

export function OAuthTile({ name, description, connected, onConnect, onDisconnect }: OAuthTileProps) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      if (connected) {
        await onDisconnect?.();
      } else {
        await onConnect?.();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={connected ? "default" : "secondary"}>
          {connected ? "Connected" : "Not connected"}
        </Badge>
        <Button size="sm" onClick={handleClick} disabled={pending} variant={connected ? "outline" : "default"}>
          {connected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
