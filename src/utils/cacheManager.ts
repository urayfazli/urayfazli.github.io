import { ASSET_IMAGES } from '../assets/images';
import { BACKSOUND_TRACKS } from '../data/backsoundData';

const CACHE_VERSION = 'cf-v2';
export const MEDIA_CACHE_NAME = `uray-cf-media-${CACHE_VERSION}`;
export const STATIC_CACHE_NAME = `uray-cf-static-${CACHE_VERSION}`;
const WARM_CACHE_STORAGE_KEY = 'uray_portfolio_cf_cache_warm_v2';
const CF_EDGE_META_STORAGE_KEY = 'uray_portfolio_cf_edge_meta_v1';

export interface CloudflareEdgeStatus {
  /** Cloudflare Edge cache state (`HIT`, `MISS`, `DYNAMIC`, `REVALIDATED`, `BYPASS`, or `LOCAL_CACHE`) */
  cfCacheStatus: string;
  /** Cloudflare 3-letter IATA Data Center / PoP code (e.g., `SIN`, `CGK`, `NRT`) parsed from `cf-ray` or `/cdn-cgi/trace` */
  edgeColo: string | null;
  /** Full `cf-ray` identifier if served through Cloudflare Proxy */
  cfRay: string | null;
  /** HTTP protocol negotiated with Cloudflare Edge (`http/3`, `http/2`, etc.) */
  httpProtocol: string | null;
  /** Timestamp of last update */
  updatedAt: number;
}

// In-memory ArrayBuffer cache for ultra-fast instant repeat access within the same session
const memoryBufferCache = new Map<string, ArrayBuffer>();

let latestEdgeStatus: CloudflareEdgeStatus = {
  cfCacheStatus: 'INIT',
  edgeColo: null,
  cfRay: null,
  httpProtocol: null,
  updatedAt: Date.now(),
};

/**
 * Extracts Cloudflare Edge headers (`cf-cache-status`, `cf-ray`) from any HTTP Response
 * and records the active Cloudflare PoP / cache hit state.
 */
export function recordCloudflareHeadersFromResponse(res: Response): void {
  try {
    const cfCacheStatus = res.headers.get('cf-cache-status');
    const cfRay = res.headers.get('cf-ray');
    if (!cfCacheStatus && !cfRay) return;

    // `cf-ray` format is e.g. `8c91a2b3c4d5e6f7-CGK` or `8c91a2b3c4d5e6f7-SIN`
    let edgeColo = latestEdgeStatus.edgeColo;
    if (cfRay && cfRay.includes('-')) {
      const parts = cfRay.split('-');
      const candidate = parts[parts.length - 1]?.trim();
      if (candidate && candidate.length === 3) {
        edgeColo = candidate.toUpperCase();
      }
    }

    latestEdgeStatus = {
      ...latestEdgeStatus,
      cfCacheStatus: cfCacheStatus ? cfCacheStatus.toUpperCase() : latestEdgeStatus.cfCacheStatus,
      cfRay: cfRay || latestEdgeStatus.cfRay,
      edgeColo,
      updatedAt: Date.now(),
    };

    localStorage.setItem(CF_EDGE_META_STORAGE_KEY, JSON.stringify(latestEdgeStatus));
  } catch {
    // Ignore header inspection errors on opaque responses
  }
}

/**
 * Returns the latest recorded Cloudflare Edge cache metadata.
 */
export function getCloudflareEdgeStatus(): CloudflareEdgeStatus {
  try {
    const raw = localStorage.getItem(CF_EDGE_META_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as CloudflareEdgeStatus;
    }
  } catch {
    // Ignore storage parse error
  }
  return latestEdgeStatus;
}

/**
 * Probes Cloudflare's built-in `/cdn-cgi/trace` endpoint when the site is proxied through Cloudflare
 * to identify the visitor's nearest Cloudflare Edge Data Center (`colo=CGK` / `colo=SIN`) and HTTP/3 status.
 */
async function detectCloudflareEdgeTrace(): Promise<void> {
  try {
    const res = await fetch('/cdn-cgi/trace', {
      method: 'GET',
      cache: 'no-store',
    });
    recordCloudflareHeadersFromResponse(res);
    if (!res.ok) return;

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      // SPA fallback returned index.html because domain is not currently proxied by Cloudflare
      return;
    }

    const text = await res.text();
    if (!text.includes('colo=') || !text.includes('fl=')) return;

    const lines = text.split('\n');
    const traceMap: Record<string, string> = {};
    for (const line of lines) {
      const [k, v] = line.split('=');
      if (k && v) {
        traceMap[k.trim()] = v.trim();
      }
    }

    latestEdgeStatus = {
      ...latestEdgeStatus,
      edgeColo: traceMap.colo ? traceMap.colo.toUpperCase() : latestEdgeStatus.edgeColo,
      httpProtocol: traceMap.http || latestEdgeStatus.httpProtocol,
      cfCacheStatus:
        latestEdgeStatus.cfCacheStatus === 'INIT' ? 'EDGE_ACTIVE' : latestEdgeStatus.cfCacheStatus,
      updatedAt: Date.now(),
    };

    localStorage.setItem(CF_EDGE_META_STORAGE_KEY, JSON.stringify(latestEdgeStatus));
  } catch {
    // Silent fallback when running outside a Cloudflare-proxied domain
  }
}

/**
 * Checks whether the browser + Cloudflare Edge cache has already been warmed on a previous visit.
 */
export function isWebCacheWarm(): boolean {
  try {
    return (
      localStorage.getItem(WARM_CACHE_STORAGE_KEY) === '1' ||
      localStorage.getItem('uray_portfolio_cache_warm_v1') === '1'
    );
  } catch {
    return false;
  }
}

/**
 * Marks the portfolio cache as warm so subsequent visits boot faster.
 */
export function markWebCacheWarm(): void {
  try {
    localStorage.setItem(WARM_CACHE_STORAGE_KEY, '1');
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetches a binary resource (such as an MP3/WAV track) using a 4-tier Cloudflare Hybrid cache hierarchy:
 * 1. In-memory session Map (0ms)
 * 2. Persistent Browser CacheStorage API (`uray-cf-media-cf-v2`)
 * 3. Cloudflare Edge PoP Cache (`CDN-Cache-Control` / `CF-Cache-Status: HIT`)
 * 4. Origin Network fetch (automatically stored into Cloudflare Edge, CacheStorage, and memory)
 */
export async function fetchArrayBufferWithCache(
  url: string,
  cacheName = MEDIA_CACHE_NAME
): Promise<ArrayBuffer | null> {
  // Tier 1: In-memory cache
  const memCached = memoryBufferCache.get(url);
  if (memCached && memCached.byteLength > 64) {
    return memCached;
  }

  // Tier 2: Browser CacheStorage API
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await window.caches.open(cacheName);
      const cachedResponse = await cache.match(url, { ignoreVary: true });
      if (cachedResponse && cachedResponse.ok) {
        recordCloudflareHeadersFromResponse(cachedResponse);
        const buffer = await cachedResponse.arrayBuffer();
        if (buffer.byteLength > 64) {
          memoryBufferCache.set(url, buffer);
          return buffer;
        }
      }
    } catch {
      // Fall through to Cloudflare Edge / network fetch
    }
  }

  // Tier 3 & 4: Cloudflare Edge CDN (`cache: 'default'` honors `Cloudflare-CDN-Cache-Control` & ETag)
  try {
    const response = await fetch(url, { cache: 'default' });
    if (!response.ok) return null;

    recordCloudflareHeadersFromResponse(response);

    const clonedForCache = response.clone();
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength < 64) return null;

    memoryBufferCache.set(url, buffer);

    if (typeof window !== 'undefined' && 'caches' in window && response.status === 200) {
      window.caches
        .open(cacheName)
        .then((cache) => cache.put(url, clonedForCache))
        .catch(() => {});
    }

    return buffer;
  } catch {
    return null;
  }
}

/**
 * Preloads & warms critical images and primary audio track across Cloudflare Edge PoP and Browser CacheStorage.
 */
export function warmUpCriticalAssets(): void {
  if (typeof window === 'undefined') return;

  const runWarmup = async () => {
    // Probe Cloudflare Edge trace endpoint asynchronously
    detectCloudflareEdgeTrace().catch(() => {});

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const activeWallpaper = isDesktop ? ASSET_IMAGES.bgDesktop : ASSET_IMAGES.bgMobile;
    const criticalImages = [ASSET_IMAGES.avatar, activeWallpaper];

    // 1. Warm up Cloudflare Edge PoP + Browser CacheStorage for critical illustrations
    if ('caches' in window) {
      try {
        const mediaCache = await window.caches.open(MEDIA_CACHE_NAME);
        await Promise.allSettled(
          criticalImages.map(async (imgUrl) => {
            const existing = await mediaCache.match(imgUrl);
            if (!existing) {
              const res = await fetch(imgUrl, { cache: 'default' });
              recordCloudflareHeadersFromResponse(res);
              if (res.ok && res.status === 200) {
                await mediaCache.put(imgUrl, res);
              }
            }
          })
        );
      } catch {
        // Ignore CacheStorage errors in restricted contexts
      }
    }

    // 2. Pre-cache the first audio track when connection is not in Data-Saver mode
    const navConn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const isSaveData = Boolean(navConn?.saveData);
    if (!isSaveData && BACKSOUND_TRACKS.length > 0) {
      const firstTrackUrl = BACKSOUND_TRACKS[0].audioSrc;
      if (firstTrackUrl) {
        await fetchArrayBufferWithCache(firstTrackUrl, MEDIA_CACHE_NAME);
      }
    }

    markWebCacheWarm();
  };

  if ('requestIdleCallback' in window) {
    (
      window as Window & {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback(
      () => {
        runWarmup();
      },
      { timeout: 3000 }
    );
  } else {
    setTimeout(runWarmup, 1500);
  }
}

/**
 * Initializes the Cloudflare Edge + Service Worker hybrid caching system.
 */
export function initWebCachingSystem(): void {
  if (typeof window === 'undefined') return;

  const onReady = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .catch(() => {
          // Service Worker may be restricted in some sandboxed iframe origins;
          // Cloudflare Edge CDN + Client CacheStorage + Memory caching still work seamlessly.
        });
    }

    warmUpCriticalAssets();
  };

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady, { once: true });
  }
}
