"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useOmniBox } from "@/lib/hooks/useOmniBox";

export function OmniBox() {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { submit } = useOmniBox();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    try {
      setSubmitting(true);
      const result = await submit(value);
      toast({ description: result.message });
      setValue("");
    } catch (error) {
      console.error(error);
      toast({ description: "Command failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center rounded-full border border-slate-800 bg-slate-950/80 px-5 py-3 text-sm text-slate-200"
    >
      <Search className="mr-3 h-4 w-4 text-cyan-300" />
      <Input
        value={value}
        onChange={event => setValue(event.target.value)}
        disabled={submitting}
        className="h-8 flex-1 border-none bg-transparent text-sm text-white placeholder:text-slate-500 focus-visible:ring-0"
        placeholder="Quick capture: /receipt, /txn, /nudge Marcus rent, paste screenshot…"
      />
    </form>
  );
}

