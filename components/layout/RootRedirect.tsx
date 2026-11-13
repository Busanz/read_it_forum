'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function RootRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;

    hasChecked.current = true;

    const navigation = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming;

    if (navigation?.type === 'reload' && pathname !== '/') {
      router.replace('/');
    }
  }, [pathname, router]);

  return null;
}
