// Service Worker for offline support and caching strategy
const CACHE_V1 = 'turab-root-v1';
const API_CACHE = 'turab-root-api-v1';
const IMG_CACHE = 'turab-root-img-v1';

// Install: cache critical assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_V1).then((c) => {
      c.addAll(['/']); // Cache just the root
      return null;
    }).catch(() => null) // Silently fail if offline
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter(
            (n) =>
              n !== CACHE_V1 && n !== API_CACHE && n !== IMG_CACHE
          )
          .map((n) => caches.delete(n))
      );
    })
  );
  self.clients.claim();
});

// Fetch: implement caching strategy
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Skip non-same-origin requests
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // API: network first, fallback to cache
  if (path.includes('/api/') || path.endsWith('.json')) {
    e.respondWith(networkFirst(e.request, API_CACHE));
    return;
  }

  // Images: cache first
  if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(path)) {
    e.respondWith(cacheFirst(e.request, IMG_CACHE));
    return;
  }

  // Default: network first
  e.respondWith(networkFirst(e.request, CACHE_V1));
});

// Network first: try network, fall back to cache
async function networkFirst(req, cache) {
  try {
    const res = await fetch(req);
    if (res?.status === 200) {
      const c = await caches.open(cache);
      c.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;

    // Offline fallback for navigation
    if (req.mode === 'navigate') {
      return new Response(
        '<html><body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a;"><div style="text-align: center; color: #fff;"><h1>Offline</h1><p>Check your connection</p></div></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    return new Response('Offline', { status: 503 });
  }
}

// Cache first: try cache, fall back to network
async function cacheFirst(req, cache) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res?.status === 200) {
      const c = await caches.open(cache);
      c.put(req, res.clone());
    }
    return res;
  } catch {
    // Return placeholder for images when offline
    if (req.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#ccc" width="100" height="100"/></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    return new Response('Offline', { status: 503 });
  }
}
