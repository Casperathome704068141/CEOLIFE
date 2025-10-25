// src/firebase/auth/use-user.tsx
'use client';
import {useState, useEffect} from 'react';
import {onAuthStateChanged, User} from 'firebase/auth';
import {useAuth} from '@/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return {user, loading};
}
