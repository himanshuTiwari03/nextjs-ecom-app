// hooks/useAuthGuard.ts
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function authHook(allowedRoles: string[]) {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;

    if (!user) {
      router.push('/login'); // '/login'
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, []);
}
