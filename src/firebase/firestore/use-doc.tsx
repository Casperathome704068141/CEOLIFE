// src/firebase/firestore/use-doc.tsx
'use client';
import {useState, useEffect, useMemo} from 'react';
import {doc, onSnapshot} from 'firebase/firestore';
import {useFirestore} from '@/firebase';
import {errorEmitter} from '../error-emitter';
import {FirestorePermissionError} from '../errors';

export function useDoc<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const docRef = useMemo(() => {
    if (!firestore || !path) return null;
    return doc(firestore, path);
  }, [firestore, path]);

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      docRef,
      doc => {
        if (doc.exists()) {
          setData({id: doc.id, ...doc.data()} as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async serverError => {
        const permissionError = new FirestorePermissionError({
          path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef, path]);

  return {data, loading};
}
