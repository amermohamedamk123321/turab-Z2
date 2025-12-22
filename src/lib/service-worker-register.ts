/**
 * Register service worker for offline support and intelligent caching.
 * Safe to call multiple times - won't re-register if already active.
 */
export async function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Registered successfully');

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      if (!worker) return;

      worker.addEventListener('statechange', () => {
        if (
          worker.state === 'activated' &&
          navigator.serviceWorker.controller
        ) {
          console.log('[SW] Update available');
        }
      });
    });
  } catch (error) {
    console.log('[SW] Registration failed:', error);
  }
}

/**
 * Unregister service worker (for cleanup/testing)
 */
export async function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator))
    return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
      await reg.unregister();
    }
  } catch (error) {
    console.error('[SW] Unregister failed:', error);
  }
}
