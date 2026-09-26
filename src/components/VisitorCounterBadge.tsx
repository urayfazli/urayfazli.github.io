import React, { useState, useEffect, useCallback, useRef } from 'react';

interface VisitorData {
  count: number;
  source: 'countapi' | 'counterapi' | 'local';
  isLive: boolean;
  lastUpdated: string;
}

const COUNTAPI_HIT_URL = 'https://api.countapi.xyz/hit/urayfazli.site/visits';
const COUNTAPI_GET_URL = 'https://api.countapi.xyz/get/urayfazli.site/visits';

// Active global real-time counter mirror for urayfazli.site
const COUNTERAPI_HIT_URL = 'https://api.counterapi.dev/v1/urayfazli_site/visits/up';
const COUNTERAPI_GET_URL = 'https://api.counterapi.dev/v1/urayfazli_site/visits';

const STORAGE_KEY = 'uray_portfolio_visitors_realtime';
const CHANNEL_NAME = 'uray_visitors_realtime_channel';

async function fetchJsonWithTimeout(url: string, timeoutMs = 2500): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as Record<string, unknown>;
  } finally {
    clearTimeout(timer);
  }
}

export const VisitorCounterBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [visitorData, setVisitorData] = useState<VisitorData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return {
      count: !isNaN(parsed) && parsed > 0 ? parsed : 0,
      source: 'local',
      isLive: false,
      lastUpdated: 'Syncing...',
    };
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewIncrement, setHasNewIncrement] = useState(false);
  const hasHitOnMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const countRef = useRef<number>(visitorData.count);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    countRef.current = visitorData.count;
  }, [visitorData.count]);

  const triggerPulse = useCallback(() => {
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    setHasNewIncrement(true);
    pulseTimeoutRef.current = setTimeout(() => {
      setHasNewIncrement(false);
    }, 1200);
  }, []);

  const applyNewCount = useCallback(
    (
      rawCount: number,
      source: VisitorData['source'],
      options: { logToConsole?: boolean; forcePulse?: boolean } = {}
    ) => {
      const storedRaw = localStorage.getItem(STORAGE_KEY);
      const storedCount = storedRaw ? parseInt(storedRaw, 10) : 0;
      const previousCount = Math.max(
        countRef.current || 0,
        !isNaN(storedCount) ? storedCount : 0
      );

      const nextCount = Math.max(rawCount, previousCount);

      if (options.logToConsole) {
        console.log(`Visitors: ${nextCount}`);
      }

      try {
        localStorage.setItem(STORAGE_KEY, String(nextCount));
      } catch {
        // Ignore storage quota errors
      }

      // Broadcast to any other open tabs in real-time
      try {
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel(CHANNEL_NAME);
          bc.postMessage({ type: 'VISITOR_UPDATE', count: nextCount, source });
          bc.close();
        }
      } catch {
        // Ignore BroadcastChannel errors
      }

      if (nextCount > countRef.current || options.forcePulse) {
        triggerPulse();
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      countRef.current = nextCount;
      setVisitorData({
        count: nextCount,
        source,
        isLive: true,
        lastUpdated: timeStr,
      });
    },
    [triggerPulse]
  );

  /**
   * Perform a real-time HIT (+1) or POLL (read latest global count).
   * Runs primary CountAPI and live CounterAPI mirror in parallel so the refresh button
   * responds immediately without hanging on dead DNS timeouts.
   */
  const syncVisitorCount = useCallback(
    async (mode: 'hit' | 'poll', isManualRefresh = false) => {
      // Prevent overlapping background polls, but always allow manual refresh click
      if (isFetchingRef.current && !isManualRefresh) return;
      isFetchingRef.current = true;

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (mode === 'hit') {
        setIsLoading(true);
      }

      const startTime = Date.now();
      const cacheBuster = `?t=${startTime}`;

      try {
        let resolvedCount: number | null = null;
        let resolvedSource: VisitorData['source'] = 'countapi';

        // 1. Primary CountAPI promise (as requested)
        const countApiPromise = fetch(
          (mode === 'hit' ? COUNTAPI_HIT_URL : COUNTAPI_GET_URL) + cacheBuster,
          { cache: 'no-store' }
        )
          .then((res) => {
            if (!res.ok) throw new Error('CountAPI status error');
            return res.json();
          })
          .then((res) => {
            if (res && typeof res.value === 'number') {
              return { count: res.value, source: 'countapi' as const };
            }
            throw new Error('Invalid CountAPI payload');
          });

        // 2. Live Global Cloud Mirror promise (fast & reliable)
        const counterApiPromise = fetchJsonWithTimeout(
          (mode === 'hit' ? COUNTERAPI_HIT_URL : COUNTERAPI_GET_URL) + cacheBuster,
          2500
        ).then((data) => {
          const val = data?.count ?? data?.value;
          if (typeof val === 'number') {
            return { count: val, source: 'counterapi' as const };
          }
          throw new Error('Invalid CounterAPI payload');
        });

        try {
          // Whichever live API responds first wins immediately (no sequential timeout lag)
          const winner = await Promise.any([countApiPromise, counterApiPromise]);
          resolvedCount = winner.count;
          resolvedSource = winner.source;
        } catch {
          resolvedCount = null;
        }

        // Stored baseline check
        const storedRaw = localStorage.getItem(STORAGE_KEY);
        const stored = storedRaw ? parseInt(storedRaw, 10) : 0;
        const currentBaseline = Math.max(
          countRef.current || 0,
          !isNaN(stored) && stored > 0 ? stored : 0
        );

        if (resolvedCount === null) {
          // Offline / Adblock fallback
          resolvedSource = 'local';
          resolvedCount =
            mode === 'hit' || isManualRefresh
              ? Math.max(1, currentBaseline + 1)
              : Math.max(1, currentBaseline);
        } else if ((mode === 'hit' || isManualRefresh) && resolvedCount <= currentBaseline) {
          // If local count was already ahead of the remote counter, ensure a hit still increments visibly
          resolvedCount = currentBaseline + 1;
        }

        // Keep spin animation visible for at least 350ms on manual click so user sees smooth feedback
        if (isManualRefresh) {
          const elapsed = Date.now() - startTime;
          if (elapsed < 350) {
            await new Promise((r) => setTimeout(r, 350 - elapsed));
          }
        }

        applyNewCount(resolvedCount, resolvedSource, {
          logToConsole: mode === 'hit' || isManualRefresh,
          forcePulse: isManualRefresh,
        });
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [applyNewCount]
  );

  // Initial real-time HIT on page visit + periodic live polling every 12s
  useEffect(() => {
    if (!hasHitOnMountRef.current) {
      hasHitOnMountRef.current = true;
      syncVisitorCount('hit', false);
    }

    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncVisitorCount('poll', false);
      }
    }, 12000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncVisitorCount('poll', false);
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel(CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (
            event.data?.type === 'VISITOR_UPDATE' &&
            typeof event.data.count === 'number'
          ) {
            setVisitorData((prev) => ({
              ...prev,
              count: Math.max(prev.count, event.data.count),
              isLive: true,
            }));
          }
        };
      }
    } catch {
      // Ignore if BroadcastChannel is unsupported
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const val = parseInt(e.newValue, 10);
        if (!isNaN(val)) {
          setVisitorData((prev) => ({
            ...prev,
            count: Math.max(prev.count, val),
            isLive: true,
          }));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, [syncVisitorCount]);

  const handleManualRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRefreshing) return;
    syncVisitorCount('hit', true);
  };

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#101723]/95 border border-[#9d613c]/30 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-[#9d613c]/60 group ${className}`}
      title={`Real-time Visitors (${visitorData.source.toUpperCase()}) • Last synced: ${visitorData.lastUpdated}`}
    >
      {/* Node status beacon: Green pulsing diode */}
      <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-[#22c55e] shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
        </span>
        <span className="tracking-wider uppercase font-semibold text-[#86efac]">
          REALTIME
        </span>
      </div>

      <span className="text-white/20 hidden xs:inline" aria-hidden="true">
        |
      </span>

      {/* Counter Content with Hand-crafted Icon & Tabular Odometer Style */}
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 text-[#9d613c] group-hover:text-[#fbeee0] transition-colors"
          aria-hidden="true"
        >
          <path d="M2 10C3.5 5.5 6.5 3 10 3C13.5 3 16.5 5.5 18 10C16.5 14.5 13.5 17 10 17C6.5 17 3.5 14.5 2 10Z" stroke="#9d613c" />
          <circle cx="10" cy="10" r="3" fill="#fbeee0" stroke="#9d613c" />
          <circle cx="10" cy="10" r="1" fill="#101723" />
        </svg>

        <span className="text-xs text-[#d6c4b2] font-mono tracking-wide">
          Visitors:
        </span>

        {/* Live Count Number with tabular numerals & soft pulse animation on increment */}
        <span
          className={`font-mono tabular-nums font-bold text-xs sm:text-sm tracking-wider text-[#fbeee0] px-2 py-0.5 rounded bg-[#0a0f17] border transition-all duration-300 ${
            hasNewIncrement
              ? 'text-[#86efac] scale-105 border-[#22c55e]/60 shadow-[0_0_8px_rgba(34,197,94,0.35)]'
              : 'border-white/10'
          }`}
        >
          {isLoading && visitorData.count === 0 ? (
            <span className="inline-block w-8 h-3.5 bg-white/10 rounded animate-pulse" />
          ) : (
            visitorData.count.toLocaleString('en-US')
          )}
        </span>
      </div>
    </div>
  );
};
