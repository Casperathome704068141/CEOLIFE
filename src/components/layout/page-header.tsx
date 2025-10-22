"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <motion.h1
          className="text-3xl font-headline font-semibold tracking-tight text-primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          {title}
        </motion.h1>
        {description ? (
          <motion.p
            className="text-sm text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            {description}
          </motion.p>
        ) : null}
      </div>
      {actions ? (
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          {actions}
        </motion.div>
      ) : null}
    </div>
  );
}

export function PagePrimaryAction({ children }: { children: ReactNode }) {
  return (
    <Button
      size="lg"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-6 font-medium text-white shadow-xl shadow-cyan-900/40 transition hover:shadow-2xl focus-visible:ring-cyan-400"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-2xl bg-white/10 mix-blend-overlay" />
    </Button>
  );
}

export function PageSecondaryAction({ children }: { children: ReactNode }) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="rounded-2xl border-slate-700 bg-slate-900/40 text-slate-200 backdrop-blur transition hover:bg-slate-800"
    >
      {children}
    </Button>
  );
}
