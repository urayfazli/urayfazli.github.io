// Real-Time Visitors Serverless API (/api/visitors)
// Supports ?mode=up (increment & return live count) and ?mode=get (read current live count)

let fallbackMemoryCount = 1;

export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const mode = req.query?.mode === 'get' ? 'get' : 'up';
  const namespace = 'urayfazli-web3-portfolio';
  const key = 'site-visitors';
  const action = mode === 'get' ? 'get' : 'hit';
  const ts = Date.now();

  // 1. Primary Real-Time Counter: Abacus (with cache-busting query string)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const endpoint = `https://abacus.jasoncameron.dev/${action}/${namespace}/${key}?_t=${ts}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      },
    });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      const count = typeof data?.value === 'number' ? data.value : data?.count;
      if (typeof count === 'number' && !Number.isNaN(count)) {
        fallbackMemoryCount = Math.max(fallbackMemoryCount, count);
        return res.status(200).json({
          count,
          value: count,
          timestamp: ts,
          source: 'abacus-realtime',
        });
      }
    }
  } catch {
    // Proceed to secondary real-time counter API
  }

  // 2. Secondary Real-Time Counter: CounterAPI.dev
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const counterApiUrl =
      mode === 'get'
        ? `https://api.counterapi.dev/v1/${namespace}/${key}/?_t=${ts}`
        : `https://api.counterapi.dev/v1/${namespace}/${key}/up?_t=${ts}`;

    const response = await fetch(counterApiUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store',
      },
    });
    clearTimeout(timer);

    if (response.ok) {
      const data = await response.json();
      const count = typeof data?.count === 'number' ? data.count : data?.value;
      if (typeof count === 'number' && !Number.isNaN(count)) {
        fallbackMemoryCount = Math.max(fallbackMemoryCount, count);
        return res.status(200).json({
          count,
          value: count,
          timestamp: ts,
          source: 'counterapi-realtime',
        });
      }
    }
  } catch {
    // Proceed to memory fallback
  }

  if (mode === 'up') {
    fallbackMemoryCount += 1;
  }

  return res.status(200).json({
    count: fallbackMemoryCount,
    value: fallbackMemoryCount,
    timestamp: ts,
    source: 'memory-fallback',
  });
}
