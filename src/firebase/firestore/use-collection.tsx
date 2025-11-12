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
  FirestoreError,
} from 'firebase/firestore';
import {useFirestore} from '@/firebase';
import {errorEmitter} from '../error-emitter';
import {FirestorePermissionError} from '../errors';

interface UseCollectionOptions {
  query?: [string, '==', any];
  isCollectionGroup?: boolean;
  skip?: boolean;
}

export function useCollection<T>(path: string, options?: UseCollectionOptions) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  const {query: queryOptions, isCollectionGroup, skip} = options ?? {};

  const memoizedQuery = useMemo(() => {
    if (!firestore || skip) return null;

    const collectionReference: Query<DocumentData> = isCollectionGroup
      ? collectionGroup(firestore, path)
      : collection(firestore, path);

    if (queryOptions) {
      return query(collectionReference, where(...queryOptions));
    }

    return collectionReference;
  }, [
    firestore,
    path,
    isCollectionGroup,
    skip,
    queryOptions?.[0],
    queryOptions?.[1],
    queryOptions?.[2],
  ]);

  useEffect(() => {
    if (!memoizedQuery) {
      setData([]);
      setLoading(false);
      return;
    }

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
      (serverError: FirestoreError) => {
        setLoading(false);
        setData([]);

        if (serverError?.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        } else {
          console.error('Firestore listener error', serverError);
        }
      }
    );

    return () => unsubscribe();
  }, [memoizedQuery, path]);

  return {data, loading};
}

    