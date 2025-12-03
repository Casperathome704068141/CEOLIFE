"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ModuleErrorBoundaryProps {
  children: React.ReactNode;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
}

export class ModuleErrorBoundary extends React.Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ModuleErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Module error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-amber-500/40 bg-amber-500/10 px-6 py-12 text-center text-amber-100 shadow-[0_15px_50px_rgba(251,191,36,0.15)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold tracking-[0.2em]">MODULE OFFLINE</p>
          <p className="text-sm text-amber-100/80">A subsystem failed to render. Telemetry has been captured for engineering.</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:border-cyan-400 hover:bg-cyan-500/20"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCw className="h-4 w-4" />
            Retry Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
