// src/components/FirebaseErrorListener.tsx
"use client";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export function FirebaseErrorListener() {
  const { toast } = useToast();
  const lastErrorMessage = useRef<string | null>(null);

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      const message = error.toString();

      if (lastErrorMessage.current === message) {
        return;
      }

      lastErrorMessage.current = message;

      console.warn("Firestore permission error", error.context);

      toast({
        variant: "destructive",
        title: "Unable to reach Firestore",
        description: "Your account does not have permission to view this data. Verify Firebase security rules or sign in with an authorized user.",
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
