"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssistantMessage, ExecLogEntry } from "@/lib/assistant/types";
import { Message } from "./Message";

export function Thread({
  messages,
  loading,
  onAction,
  execLogs,
}: {
  messages: AssistantMessage[];
  loading?: boolean;
  onAction?: (message: AssistantMessage, action: import("@/lib/assistant/types").Action) => void;
  execLogs?: Record<string, ExecLogEntry>;
}) {
  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Message message={message} onAction={onAction} execLogs={execLogs} />
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-1/3 bg-slate-800/80" />
              <Skeleton className="h-16 rounded-2xl bg-slate-900/60" />
              <Skeleton className="h-4 w-1/4 bg-slate-800/70" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
