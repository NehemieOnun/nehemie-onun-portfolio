// Serveur local (npm run dev / npm start). Sur Vercel, c'est api/index.ts qui est utilisé.
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const PORT = Number(process.env.PORT) || 3000;
// Production si NODE_ENV=production OU si on exécute le bundle compilé (npm start → dist/server.cjs).
const IS_PROD = process.env.NODE_ENV === 'production' || (process.argv[1] ?? '').endsWith('.cjs');

async function start() {
  const { createApp } = await import('./server/app.js');
  const app = createApp();

  if (!IS_PROD) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, watch: { ignored: ['**/.env*', '**/data/**'] } },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        }
      })
    );
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Site : http://localhost:${PORT}   ·   Admin : http://localhost:${PORT}/admin`);
    if (!process.env.DATABASE_URL) console.log('[stockage] DATABASE_URL absent → fichier local data/local-db.json');
    if (!process.env.ADMIN_PASSWORD) console.log('[admin] ADMIN_PASSWORD absent → connexion au tableau de bord impossible');
    if (!process.env.GEMINI_API_KEY) console.log("[chat] GEMINI_API_KEY absent → l'assistant renverra une réponse de secours");
  });
}

start();
