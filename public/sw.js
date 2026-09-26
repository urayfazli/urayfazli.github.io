/**
 * Uray Fazli Alman Portfolio — Cloudflare Edge + Service Worker Hybrid Caching Engine
 *
 * Designed to work in tandem with Cloudflare CDN (`Cloudflare-CDN-Cache-Control` & `CF-Cache-Status`):
 * 1. Bypasses `/cdn-cgi/*` so Cloudflare internal Edge endpoints (Trace, Turnstile, RUM, Zaraz, Speed Brain) operate natively
 * 2. Cache-First for immutable `/assets/*` bundles, heavy media (`.png`, `.svg`, `.mp3`, `.wav`), and Google Fonts (`.woff2`)
 * 3. Stale-While-Revalidate for application shell (`index.html`, `manifest.webmanifest`) backed by Cloudflare Edge SWR
 * 4. Uses `cache: 'default'` so fetches pull from the nearest Cloudflare Edge PoP (`CF-Cache-Status: HIT`)
 */

const CACHE_VERSION = 'cf-v2';
const STATIC_CACHE = `uray-cf-static-${CACHE_VERSION}`;
const MEDIA_CACHE = `uray-cf-media-${CACHE_VERSION}`;
const FONTS_CACHE = `uray-cf-fonts-${CACHE_VERSION}`;

const ACTIVE_CACHES = [STATIC_CACHE, MEDIA_CACHE, FONTS_CACHE];

const PRECACHE_URLS = [
  './',
  './index.html',
  './favicon.svg?v=5',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            // Use 'default' cache mode so Cloudflare Edge PoP & browser HTTP cache are utilized
            fetch(url, { cache: 'default' }).then((res) => {
              if (res && res.status === 200) {
                return cache.put(url, res);
              }
            })
          )
        )
      )
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (
              (key.startsWith('uray-node-') || key.startsWith('uray-cf-')) &&
              !ACTIVE_CACHES.includes(key)
            ) {
              return caches.delete(key);
            }
            return undefined;
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Helper: Cache-First strategy backed by Cloudflare Edge CDN
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request, { ignoreVary: true });
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request, { cache: 'default' });
    // Only cache complete 200 OK responses (never 206 Partial Content which Cache.put rejects)
    if (
      networkResponse &&
      networkResponse.status === 200 &&
      (networkResponse.type === 'basic' || networkResponse.type === 'cors')
    ) {
      cache.put(request, networkResponse.clone()).catch(() => {});
    }
    return networkResponse;
  } catch (err) {
    const fallback = await cache.match(request, { ignoreSearch: true });
    if (fallback) return fallback;
    throw err;
  }
}

/**
 * Helper: Stale-While-Revalidate strategy synced with Cloudflare Edge SWR
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request, { cache: 'default' })
    .then((networkResponse) => {
      if (
        networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type === 'basic'
      ) {
        cache.put(request, networkResponse.clone()).catch(() => {});
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Ignore unsupported schemes (chrome-extension, data, blob)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // CRITICAL FOR CLOUDFLARE: Never intercept `/cdn-cgi/*` endpoints
  // (Cloudflare Trace, Turnstile Challenge, Web Analytics RUM, Zaraz, Image Resizing, Speed Brain)
  if (url.pathname.startsWith('/cdn-cgi/')) {
    return;
  }

  // Bypass real-time visitor counter endpoints & Vite HMR websocket/ping requests
  if (
    url.hostname.includes('countapi') ||
    url.hostname.includes('counterapi') ||
    url.pathname.includes('/@vite') ||
    url.pathname.includes('/@react-refresh') ||
    url.pathname.includes('/__vite') ||
    url.searchParams.has('t')
  ) {
    return;
  }

  // Avoid intercepting Range header requests directly so Cloudflare Edge Range streaming works cleanly
  if (request.headers.has('range')) {
    return;
  }

  // 1. Google Fonts & Cloudflare Font binaries -> Cache-First in FONTS_CACHE
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    /\.(woff2?|ttf|otf|eot)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, FONTS_CACHE));
    return;
  }

  // 2. Vite Immutable Content-Hashed Assets (`/assets/*`) -> Cache-First (1-year Immutable on Cloudflare Edge)
  if (url.origin === self.location.origin && url.pathname.includes('/assets/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // 3. Same-origin Images & Audio files -> Cache-First in MEDIA_CACHE
  if (
    url.origin === self.location.origin &&
    /\.(jpe?g|png|gif|webp|svg|ico|mp3|wav|ogg|m4a)$/i.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE));
    return;
  }

  // 4. Same-origin App Shell (HTML, Manifest, Unhashed Scripts) -> Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  }
});
