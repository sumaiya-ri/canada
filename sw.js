const CACHE_NAME = 'static-site-cache-v1';
const ASSETS_TO_CACHE = [
  '/', // The main HTML page
  '/PWA WEBSITE/index.html',
  '/PWA WEBSITE/styles/pwa.css',
  '/PWA WEBSITE/scripts/canada.jpg', // example image, replace with your assets
  '/PWA WEBSITE/favicon.ico' // example favicon, replace as needed
];

// Install event: Caching assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event: Clean up old caches if necessary
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content when offline or if network fails
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // Return cached response if available
      }
      return fetch(event.request); // Otherwise fetch from network
    })
  );
});
