// ═══════════════════════════════════════════════════════════
// MISSAL ROMANO — Service Worker (Offline)
// ═══════════════════════════════════════════════════════════

var CACHE_NAME = 'missal-romano-v6';
var ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/pix-qrcode.png',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt'
];

// Instalar — cachear todos os assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativar — limpar caches antigos
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — cache first, fallback to network
self.addEventListener('fetch', function (event) {
  // Ignore non-GET and cross-origin font requests that may fail
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        // Cache successful same-origin responses
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function () {
        // Offline fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
