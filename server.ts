import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chibiChatHandler from './api/chibi-chat.js';
import notesHandler from './api/notes.js';
import visitorsHandler from './api/visitors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Server-side API routes
  app.all('/api/chibi-chat', (req, res) => chibiChatHandler(req, res));
  app.all('/api/notes', (req, res) => notesHandler(req, res));
  app.all('/api/visitors', (req, res) => visitorsHandler(req, res));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
