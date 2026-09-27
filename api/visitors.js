export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const mode = req.query?.mode === 'get' ? 'get' : 'up';
  const namespace = 'urayfazli-web3-portfolio';
  const key = 'site-visitors';

  try {
    const endpoint =
      mode === 'get'
        ? `https://api.counterapi.dev/v1/${namespace}/${key}/`
        : `https://api.counterapi.dev/v1/${namespace}/${key}/up`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (typeof data?.count === 'number') {
        return res.status(200).json({
          count: data.count,
          source: 'vercel-serverless',
        });
      }
    }
  } catch {
    // Fallback below if external counter API is unreachable
  }

  return res.status(200).json({
    count: null,
    source: 'vercel-fallback',
  });
}
