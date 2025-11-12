"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUser } from "@/firebase";

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      fallback ?? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/80 px-6 py-4 text-sm text-slate-200 shadow-lg shadow-cyan-900/20">
            <Loader2 className="h-4 w-4 animate-spin" />
            Initializing your command center…
          </div>
        </div>
      )
    );
  }

  if (!user) {
    return fallback ?? null;
  }

  return <>{children}</>;
}
