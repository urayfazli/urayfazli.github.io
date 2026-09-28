// Serverless Collaboration Notes API (/api/notes)
// Stores and returns recent Web3 collaboration notes in memory across warm invocations
// and increments the global collaboration note counter on Abacus.

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const SEED_TIME_MS = Date.now();

const INITIAL_NOTES = [
  {
    id: 'seed-note-1',
    senderName: 'Raka Pratama',
    senderHandle: '@rakaw3_node',
    topic: 'Node Infrastructure',
    message: 'Halo bro Uray! Mantap setup full node Aptos & Sei-nya. Ayo diskusi bareng soal monitoring RPC & validator testnet terbaru.',
    createdAt: new Date(SEED_TIME_MS - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAtMs: SEED_TIME_MS - 2 * 24 * 60 * 60 * 1000,
    expiresAtMs: SEED_TIME_MS + 28 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'seed-note-2',
    senderName: 'Kevin Solana',
    senderHandle: '@kevinsol_alpha',
    topic: 'Airdrop & Quest Alpha',
    message: 'Salam kenal! Sering pantau garapan testnet & modular L2 juga. Siap kolaborasi tukar info early alpha.',
    createdAt: new Date(SEED_TIME_MS - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAtMs: SEED_TIME_MS - 1 * 24 * 60 * 60 * 1000,
    expiresAtMs: SEED_TIME_MS + 29 * 24 * 60 * 60 * 1000,
  },
];

let memoryNotes = [...INITIAL_NOTES];

function sanitizeField(val, maxLen) {
  return String(val || '')
    .replace(/<\s*\/?\s*script[^>]*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim()
    .slice(0, maxLen);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();
  memoryNotes = memoryNotes.filter((n) => !n.expiresAtMs || now < n.expiresAtMs);

  if (req.method === 'GET') {
    return res.status(200).json({
      notes: memoryNotes.slice(0, 25),
      count: memoryNotes.length,
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const senderName = sanitizeField(body.senderName, 60);
      const senderHandle = sanitizeField(body.senderHandle, 80);
      const topic = sanitizeField(body.topic || 'Node Infrastructure', 60);
      const message = sanitizeField(body.message, 500);
      const authorToken = sanitizeField(body.authorToken, 80);

      if (!senderName || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      const createdAtMs = Date.now();
      const expiresAtMs = createdAtMs + ONE_MONTH_MS;

      const newNote = {
        id: `note-${createdAtMs}-${Math.random().toString(36).slice(2, 7)}`,
        senderName,
        senderHandle: senderHandle || 'Web3 Explorer',
        topic,
        message,
        createdAt: new Date(createdAtMs).toISOString(),
        createdAtMs,
        expiresAtMs,
        ...(authorToken ? { authorToken } : {}),
      };

      memoryNotes = [newNote, ...memoryNotes].slice(0, 30);

      // Fire-and-forget global counter hit
      fetch('https://abacus.jasoncameron.dev/hit/urayfazli-web3-portfolio/collab-notes').catch(
        () => {}
      );

      return res.status(201).json({
        note: newNote,
        notes: memoryNotes.slice(0, 25),
      });
    } catch (err) {
      return res.status(500).json({
        error: err instanceof Error ? err.message : 'Failed to save collaboration note',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const noteId = sanitizeField(body.id || req.query?.id, 128);
      const authorToken = sanitizeField(body.authorToken || req.query?.authorToken, 80);

      if (!noteId) {
        return res.status(400).json({ error: 'Note ID is required' });
      }

      memoryNotes = memoryNotes.filter((n) => {
        if (n.id !== noteId) return true;
        if (n.authorToken && authorToken && n.authorToken === authorToken) return false;
        if (n.expiresAtMs && Date.now() >= n.expiresAtMs) return false;
        return true;
      });

      return res.status(200).json({
        notes: memoryNotes.slice(0, 25),
        count: memoryNotes.length,
      });
    } catch {
      return res.status(400).json({ error: 'Invalid delete request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
