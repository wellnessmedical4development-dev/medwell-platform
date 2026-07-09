const CACHE = 'medwell-landing-v2';
const ROUTES = ['/', '/services', '/about', '/contact', '/app', '/download'];
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) {
    e.respondWith(fetch(request).catch(() => new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
    return;
  }
  e.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => {
          if (request.url.startsWith(self.location.origin)) c.put(request, clone);
        });
        return res;
      })
      .catch(() => caches.match(request))
  );
});
