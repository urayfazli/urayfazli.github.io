export default async function handler(req, res) {
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
  );
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const mode = req.query?.mode === 'get' ? 'get' : 'up';
  const namespace = 'urayfazli-web3-portfolio';
  const key = 'site-visitors';
  const action = mode === 'get' ? 'get' : 'hit';

  try {
    const endpoint = `https://abacus.jasoncameron.dev/${action}/${namespace}/${key}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const count = typeof data?.value === 'number' ? data.value : data?.count;
      if (typeof count === 'number') {
        return res.status(200).json({
          count,
          value: count,
          timestamp: Date.now(),
          source: 'vercel-realtime',
        });
      }
    }
  } catch (err) {
    return res.status(502).json({
      count: null,
      error: err instanceof Error ? err.message : 'Upstream counter error',
    });
  }

  return res.status(502).json({
    count: null,
    source: 'vercel-fallback',
  });
}
