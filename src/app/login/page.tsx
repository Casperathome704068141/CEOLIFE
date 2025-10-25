"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "@/firebase";

export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-cyan-400">
            BENO 1017
          </h1>
          <p className="mt-2 text-slate-300">Your AI Chief of Staff</p>
        </div>
        <Button
          onClick={handleSignIn}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 py-6 text-lg font-semibold text-slate-950 shadow-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign in with Google"}
        </Button>
      </div>
    </div>
  );
}
