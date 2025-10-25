// src/firebase/auth/use-user.tsx
'use client';
import {useState, useEffect} from 'react';
import {onAuthStateChanged, User, signInAnonymously} from 'firebase/auth';
import {useAuth} from '@/firebase';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        // For demo purposes, we'll sign in the user anonymously
        // if they are not already logged in.
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
        } catch (error) {
          console.error("Anonymous sign-in failed", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return {user, loading};
}
