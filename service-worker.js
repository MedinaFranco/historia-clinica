const CACHE_NAME = 'historia-clinica-v1';
const urlsToCache = [
  './historia_clinica.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          function(response) {
            if(!response || response.status !== 200) {
                if (response.type !== 'opaque') {
                    return response;
                }
            }

            var responseToCache = response.clone();
            
            if (event.request.method === 'GET') {
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
            }

            return response;
          }
        ).catch(function() {
            console.log('Failed to fetch and not in cache:', event.request.url);
        });
      })
  );
});
