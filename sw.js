// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll(RECIPE_URLS);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // B7. Rispondi all'evento aprendo la cache usando CACHE_NAME
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      // B8. Se la risorsa è in cache, restituiscila. 
      // Altrimenti fai il fetch, salvala in cache e poi restituisci la risposta di rete.
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Risorsa trovata in cache
          return cachedResponse;
        }

        // Risorsa NON in cache: procedi con la richiesta di rete
        return fetch(event.request).then((networkResponse) => {
          // Salva un clone della risposta di rete in cache per usi futuri
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});