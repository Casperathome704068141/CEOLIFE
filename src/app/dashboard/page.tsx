'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import DashboardPageContent from '@/app/(app)/page';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <DashboardPageContent />;
}
