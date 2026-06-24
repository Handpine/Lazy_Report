const CACHE_NAME = 'lazy-report-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './assets/dexie.js',
  './assets/react.production.min.js',
  './assets/react-dom.production.min.js',
  './assets/babel.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
