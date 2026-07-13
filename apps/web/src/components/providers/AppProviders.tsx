'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const loadMe = useAuthStore((s) => s.loadMe);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  return <>{children}</>;
}
