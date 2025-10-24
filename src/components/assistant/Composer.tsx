"use client";

import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Send, Paperclip, Loader2, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Command as CommandRoot,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAssistantContext } from "@/lib/assistant/context";
import type { CommandSuggestion } from "@/lib/assistant/types";

const SLASH_COMMANDS: CommandSuggestion[] = [
  {
    id: "briefing",
    trigger: "/briefing",
    description: "Run a structured briefing",
    insertText: "/briefing morning",
  },
  {
    id: "add",
    trigger: "/add",
    description: "Capture a new transaction, goal, or event",
    insertText: "/add txn",
  },
  {
    id: "simulate",
    trigger: "/simulate",
    description: "Model a scenario",
    insertText: "/simulate rent +12%",
  },
  {
    id: "rule",
    trigger: "/rule",
    description: "Automate with an if/then rule",
    insertText: "/rule when groceries > 90% before month end then nudge Marcus",
  },
  {
    id: "nudge",
    trigger: "/nudge",
    description: "Send a WhatsApp or SMS nudge",
    insertText: "/nudge Marcus Need anything from Costco?",
  },
  {
    id: "find",
    trigger: "/find",
    description: "Search docs, transactions, or events",
    insertText: "/find doc rent ledger",
  },
];

export function Composer({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}) {
  const { chips, toggleChip, attachments, removeAttachment, addAttachment } =
    useAssistantContext();
  const [showCommands, setShowCommands] = useState(false);

  const activeChips = useMemo(() => chips.filter((chip) => chip.active), [chips]);

  const onDrop = useMemo(
    () =>
      (accepted: File[]) => {
        accepted.forEach((file) => {
          addAttachment({
            id: `${file.name}-${file.size}`,
            name: file.name,
            type: file.type,
            size: file.size,
          });
        });
      },
    [addAttachment],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur"
    >
      <input {...getInputProps()} className="hidden" />
      {isDragActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90">
          <p className="text-sm text-slate-200">Drop files to attach</p>
        </div>
      )}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Badge
              key={chip.id}
              variant={chip.active ? "default" : "outline"}
              onClick={() => toggleChip(chip.id)}
              className="cursor-pointer bg-slate-800/80 px-3 py-1 text-xs font-medium hover:bg-slate-700"
            >
              {chip.label}
            </Badge>
          ))}
        </div>

        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ask Beno to capture, reconcile, or plan. Shift+Enter for newline."
          className="min-h-[120px] resize-none border-0 bg-transparent text-sm text-slate-100 focus-visible:ring-0"
          onFocus={() => setShowCommands(false)}
          onKeyDown={(event) => {
            if (event.key === "/") {
              setShowCommands(true);
            }
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
        />

        {attachments.length > 0 && (
          <ScrollArea className="-mx-4 rounded-b-3xl bg-slate-900/40 px-4 py-3">
            <div className="flex flex-wrap gap-3">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs"
                >
                  <Paperclip className="h-3 w-3" />
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeAttachment(file.id)}
                    className="text-slate-400 transition hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Command className="h-3.5 w-3.5" />
            <span>{activeChips.length} context chips active</span>
          </div>
          <Button size="sm" onClick={onSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Routing
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>

      {showCommands && (
        <CommandRoot className="absolute bottom-[calc(100%+0.5rem)] left-0 right-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 text-left shadow-lg">
          <CommandInput placeholder="Type a slash command" autoFocus />
          <CommandList>
            <CommandEmpty>No commands found.</CommandEmpty>
            {SLASH_COMMANDS.map((cmd) => (
              <CommandItem
                key={cmd.id}
                value={cmd.trigger}
                onSelect={() => {
                  onChange(cmd.insertText);
                  setShowCommands(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-100">
                    {cmd.trigger}
                  </span>
                  <span className="text-xs text-slate-400">{cmd.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </CommandRoot>
      )}
    </div>
  );
}
