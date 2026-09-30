// Serverless Collaboration Notes API (/api/notes)
// Stores and returns recent Web3 collaboration notes in memory across warm invocations
// and increments the global collaboration note counter on Abacus.

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const SEED_TIME_MS = Date.now();
const DEFAULT_FIREBASE_PROJECT_ID = 'gen-lang-client-0789777076';
const DEFAULT_FIRESTORE_DB_ID =
  'ai-studio-urayfazlialmanwe-65462674-8187-4b73-aed0-324c8f7c007e';

function getServerFirebaseConfig() {
  const apiKey = (process.env.FIREBASE_API_KEY || '').trim();
  const projectId = (
    process.env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID
  ).trim();
  const databaseId = (
    process.env.FIREBASE_DATABASE_ID || DEFAULT_FIRESTORE_DB_ID
  ).trim();
  return {
    apiKey,
    projectId,
    databaseId,
    enabled: Boolean(apiKey && apiKey.startsWith('AIza') && projectId && databaseId),
  };
}

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
  const fbConfig = getServerFirebaseConfig();
  const baseCollectionUrl = fbConfig.enabled
    ? `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(fbConfig.projectId)}/databases/${encodeURIComponent(fbConfig.databaseId)}/documents/collaboration_notes`
    : '';

  if (req.method === 'GET') {
    if (fbConfig.enabled) {
      try {
        const resp = await fetch(
          `${baseCollectionUrl}?pageSize=25&key=${encodeURIComponent(fbConfig.apiKey)}`,
          { signal: AbortSignal.timeout(4500) }
        );
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data?.documents) && data.documents.length > 0) {
            const firestoreNotes = data.documents
              .map((docItem) => {
                const fields = docItem.fields || {};
                const docId = String(docItem.name || '').split('/').pop() || `note-${now}`;
                const createdAtMs = Number(fields.createdAtMs?.integerValue || now);
                const expiresAtMs = Number(
                  fields.expiresAtMs?.integerValue || createdAtMs + ONE_MONTH_MS
                );
                return {
                  id: docId,
                  senderName: String(fields.senderName?.stringValue || 'Web3 Explorer'),
                  senderHandle: String(fields.senderHandle?.stringValue || 'Explorer'),
                  topic: String(fields.topic?.stringValue || 'Node Infrastructure'),
                  message: String(fields.message?.stringValue || ''),
                  createdAt: String(
                    fields.createdAt?.stringValue || new Date(createdAtMs).toISOString()
                  ),
                  createdAtMs,
                  expiresAtMs,
                };
              })
              .filter((n) => n.message && now < n.expiresAtMs)
              .sort((a, b) => b.createdAtMs - a.createdAtMs);

            if (firestoreNotes.length > 0) {
              memoryNotes = firestoreNotes.slice(0, 25);
            }
          }
        }
      } catch {
        // Fallback to memoryNotes
      }
    }

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
      const safeHandle = senderHandle || 'Web3 Explorer';
      const createdAtIso = new Date(createdAtMs).toISOString();
      const docId = `note-${createdAtMs}-${Math.random().toString(36).slice(2, 7)}`;

      if (fbConfig.enabled) {
        try {
          await fetch(
            `${baseCollectionUrl}?documentId=${encodeURIComponent(docId)}&key=${encodeURIComponent(fbConfig.apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  senderName: { stringValue: senderName },
                  senderHandle: { stringValue: safeHandle },
                  topic: { stringValue: topic },
                  message: { stringValue: message },
                  createdAt: { stringValue: createdAtIso },
                  createdAtMs: { integerValue: String(createdAtMs) },
                  expiresAtMs: { integerValue: String(expiresAtMs) },
                  ...(authorToken ? { authorToken: { stringValue: authorToken } } : {}),
                },
              }),
              signal: AbortSignal.timeout(4500),
            }
          );
        } catch {
          // Continue with in-memory storage
        }
      }

      const newNote = {
        id: docId,
        senderName,
        senderHandle: safeHandle,
        topic,
        message,
        createdAt: createdAtIso,
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
