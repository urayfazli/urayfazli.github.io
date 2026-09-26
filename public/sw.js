/**
 * Uray Fazli Alman Portfolio — Service Worker (v4)
 *
 * Fixes navigation caching so updated deployments on GitHub Pages / Cloudflare
 * always load the latest index.html and hashed JS/CSS bundles without 404s.
 */

const CACHE_VERSION = 'cf-v4';
const STATIC_CACHE = `uray-cf-static-${CACHE_VERSION}`;
const MEDIA_CACHE = `uray-cf-media-${CACHE_VERSION}`;
const FONTS_CACHE = `uray-cf-fonts-${CACHE_VERSION}`;
const ACTIVE_CACHES = [STATIC_CACHE, MEDIA_CACHE, FONTS_CACHE];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!ACTIVE_CACHES.includes(key)) {
              return caches.delete(key);
            }
            return undefined;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request, { ignoreVary: true });
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (
    networkResponse &&
    networkResponse.status === 200 &&
    (networkResponse.type === 'basic' || networkResponse.type === 'cors')
  ) {
    cache.put(request, networkResponse.clone()).catch(() => {});
  }
  return networkResponse;
}

async function networkFirstNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone()).catch(() => {});
    }
    return networkResponse;
  } catch (err) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Never intercept Cloudflare internal endpoints or dev server requests
  if (
    url.pathname.startsWith('/cdn-cgi/') ||
    url.hostname.includes('countapi') ||
    url.hostname.includes('counterapi') ||
    url.pathname.includes('/@vite') ||
    url.pathname.includes('/@react-refresh') ||
    url.pathname.includes('/__vite') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/')
  ) {
    return;
  }

  // 1. HTML Navigation requests -> Always Network-First (never serve stale index.html with old bundle hashes)
  if (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // 2. Google Fonts -> Cache-First
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    /\.(woff2?|ttf|otf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, FONTS_CACHE));
    return;
  }

  // 3. Vite Immutable Content-Hashed Assets (`/assets/*`) -> Cache-First
  if (url.origin === self.location.origin && url.pathname.includes('/assets/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 4. Same-origin Images & Icons -> Cache-First in MEDIA_CACHE
  if (
    url.origin === self.location.origin &&
    /\.(jpe?g|png|gif|webp|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE));
  }
});
