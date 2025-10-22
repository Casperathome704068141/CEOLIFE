// src/components/FirebaseErrorListener.tsx
'use client';
import {useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {errorEmitter} from '@/firebase/error-emitter';

export function FirebaseErrorListener() {
  const {toast} = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      console.error('Firestore Permission Error:', error.toString());

      toast({
        variant: 'destructive',
        title: 'Firestore Permission Error',
        description: error.toString(),
      });
      // This will throw an error in development to surface the error in the Next.js overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
