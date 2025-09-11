// Simple offline-first cache for static site
const CACHE_NAME = 'simhireestate-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './pricing.html',
  './packages.html',
  './contact.html',
  './workforce.html',
  './business.html',
  './property.html',
  './community.html',
  './tech.html',
  './finance.html',
  './roadmap.html',
  './vision.html',
  './js/main.js',
  './js/whatsapp.js',
  './assets/logo.png',
  './assets/logo1.png',
  './assets/logo1212.png',
  './assets/logo2.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Try cache first, then network fallback
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});