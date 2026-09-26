import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite plugin that attaches Cloudflare Edge Caching headers (`CDN-Cache-Control`,
 * `Cloudflare-CDN-Cache-Control`, and `Cache-Control`) so any Cloudflare Proxy (Orange Cloud)
 * in front of the origin server automatically caches static, audio, and immutable assets at the Edge.
 */
function cloudflareEdgeCacheHeadersPlugin(): Plugin {
  const applyHeaders = (
    url: string | undefined,
    setHeader: (name: string, value: string) => void
  ) => {
    if (!url) return;
    const cleanPath = url.split('?')[0];

    if (cleanPath.startsWith('/assets/')) {
      setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      setHeader('CDN-Cache-Control', 'public, max-age=31536000, immutable');
      setHeader('Cloudflare-CDN-Cache-Control', 'public, max-age=31536000, immutable');
    } else if (cleanPath.startsWith('/audio/') || /\.(mp3|wav|ogg|m4a)$/i.test(cleanPath)) {
      setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
      setHeader(
        'CDN-Cache-Control',
        'public, max-age=2592000, stale-while-revalidate=604800, stale-if-error=2592000'
      );
      setHeader(
        'Cloudflare-CDN-Cache-Control',
        'public, max-age=2592000, stale-while-revalidate=604800, stale-if-error=2592000'
      );
      setHeader('Accept-Ranges', 'bytes');
    } else if (/\.(svg|png|jpe?g|webp|gif|ico|woff2?)$/i.test(cleanPath)) {
      setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
      setHeader('CDN-Cache-Control', 'public, max-age=2592000, stale-while-revalidate=604800');
      setHeader(
        'Cloudflare-CDN-Cache-Control',
        'public, max-age=2592000, stale-while-revalidate=604800'
      );
    } else if (cleanPath === '/' || cleanPath.endsWith('.html') || cleanPath === '/sw.js') {
      setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      setHeader(
        'CDN-Cache-Control',
        'public, max-age=60, stale-while-revalidate=600, stale-if-error=86400'
      );
      setHeader(
        'Cloudflare-CDN-Cache-Control',
        'public, max-age=60, stale-while-revalidate=600, stale-if-error=86400'
      );
    }
  };

  return {
    name: 'cloudflare-edge-cache-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        applyHeaders(req.url, (name, value) => res.setHeader(name, value));
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        applyHeaders(req.url, (name, value) => res.setHeader(name, value));
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), cloudflareEdgeCacheHeadersPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
