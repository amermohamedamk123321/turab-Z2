'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/service-worker-register';

/**
 * Registers service worker on mount for offline support and caching.
 * This is a separate client component to keep layout.tsx server-side.
 */
export function ServiceWorkerInit() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
