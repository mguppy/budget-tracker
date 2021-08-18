const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/styles.css',
    '/index.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
]

const UI_CACHE = "bank-cache-v1"
const DATA_CACHE = "data-cache-v1"

// Installing all files to cache on page load
self.addEventListener("install", event => {
    event.waitUntil(
        caches
        .open(UI_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
});

// Fetch to cache all get requests to API routes
self.addEventListener("fetch", event => {
    if (event.request.url.includes("/api/")) {
        // make network request and fallback to cache if network request fails (offline)
        event.respondWith(
          caches.open(DATA_CACHE).then(cache => {
            return fetch(event.request)
              .then(response => {
                cache.put(event.request, response.clone());
                return response;
              })
              .catch(() => caches.match(event.request));
          })
        );
        return;
      }

// use cache first for all other requests for performance
event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // request is not in cache. make network request and cache the response
      return caches.open(DATA_CACHE).then(cache => {
        return fetch(event.request).then(response => {
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      });
    })
  );
});

