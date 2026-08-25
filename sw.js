// FuelTrack service worker: app-shell cache zodat de app offline start.
const CACHE = 'fueltrack-v1';
const BESTANDEN = [
  './', './app.html', './index.html',
  './calc.js', './gps.js', './grens.js', './manifest.json',
  './icons/car.png', './icons/fuel.png', './icons/pin.png',
  './icons/chart.png', './icons/euro.png', './icons/flag.png',
  './icons/appicon-180.png', './icons/appicon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BESTANDEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first; netwerk-update op de achtergrond (stale-while-revalidate).
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // RDW-API en andere externe calls nooit cachen
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fris = fetch(e.request).then(res => {
        if (res && res.ok) {
          const kopie = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, kopie));
        }
        return res;
      }).catch(() => cached);
      return cached || fris;
    })
  );
});
