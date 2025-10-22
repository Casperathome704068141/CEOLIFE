// src/firebase/firestore/use-collection.tsx
'use client';
import {useState, useEffect, useMemo} from 'react';
import {
  collection,
  onSnapshot,
  Query,
  DocumentData,
  query,
  where,
  collectionGroup,
} from 'firebase/firestore';
import {useFirestore} from '@/firebase';
import {errorEmitter} from '../error-emitter';
import {FirestorePermissionError} from '../errors';

interface UseCollectionOptions {
  query?: [string, '==', any];
  isCollectionGroup?: boolean;
}

export function useCollection<T>(path: string, options?: UseCollectionOptions) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const memoizedQuery = useMemo(() => {
    if (!firestore) return null;
    let colRef: Query<DocumentData>;

    if (options?.isCollectionGroup) {
      colRef = collectionGroup(firestore, path);
    } else {
      colRef = collection(firestore, path);
    }

    if (options?.query) {
      return query(colRef, where(...options.query));
    }
    return colRef;
  }, [firestore, path, options]);

  useEffect(() => {
    if (!memoizedQuery) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      memoizedQuery,
      snapshot => {
        const result: T[] = [];
        snapshot.forEach(doc => {
          result.push({id: doc.id, ...doc.data()} as T);
        });
        setData(result);
        setLoading(false);
      },
      async serverError => {
        const permissionError = new FirestorePermissionError({
          path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, path]);

  return {data, loading};
}
