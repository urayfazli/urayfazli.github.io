import { ASSET_IMAGES } from '../assets/images';

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
 * Preloads & warms critical images across Cloudflare Edge PoP and Browser CacheStorage.
 */
export function warmUpCriticalAssets(): void {
  if (typeof window === 'undefined') return;

  const runWarmup = async () => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const activeWallpaper = isDesktop ? ASSET_IMAGES.bgDesktop : ASSET_IMAGES.bgMobile;
    const criticalImages = [ASSET_IMAGES.avatar, activeWallpaper];

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
          // Ignore if Service Worker is unavailable
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
