// Serverless Collaboration Notes API (/api/notes)
// Stores and returns recent Web3 collaboration notes in memory across warm invocations
// and increments the global collaboration note counter on Abacus.

const INITIAL_NOTES = [
  {
    id: 'seed-1',
    senderName: 'Raka Pratama',
    senderHandle: '@rakaw3_node',
    topic: 'Node Infrastructure',
    message: 'Halo bro Uray! Mantap setup full node Aptos & Sei-nya. Ayo diskusi bareng soal monitoring RPC & validator testnet terbaru.',
    createdAt: '2025-02-18T09:30:00.000Z',
  },
  {
    id: 'seed-2',
    senderName: 'Kevin Solana',
    senderHandle: '@kevinsol_alpha',
    topic: 'Airdrop & Quest Alpha',
    message: 'Salam kenal! Sering pantau garapan testnet & modular L2 juga. Siap kolaborasi tukar info early alpha.',
    createdAt: '2025-02-20T14:15:00.000Z',
  },
];

let memoryNotes = [...INITIAL_NOTES];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      notes: memoryNotes.slice(0, 25),
      count: memoryNotes.length,
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const senderName = String(body.senderName || '').trim().slice(0, 60);
      const senderHandle = String(body.senderHandle || '').trim().slice(0, 80);
      const topic = String(body.topic || 'Node Infrastructure').trim().slice(0, 60);
      const message = String(body.message || '').trim().slice(0, 500);

      if (!senderName || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      const newNote = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        senderName,
        senderHandle: senderHandle || 'Web3 Explorer',
        topic,
        message,
        createdAt: new Date().toISOString(),
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

  return res.status(405).json({ error: 'Method not allowed' });
}
