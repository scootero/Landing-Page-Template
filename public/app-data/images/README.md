# Landing page images

PNG/JPG files referenced by `app-config.json` are copied to `public/app-data/images/` on `npm run dev` and `npm run build`.

## Production

n8n runs `scripts/generate-app-config.js` against an App Package on Drive, which copies real assets from `media/` into this folder before Vercel deploy.

## Local dev

Regenerate from an App Package:

```bash
node scripts/generate-app-config.js ../test-app-packages/human-lab
npm run dev
```

See `app-config.example.json` for a full Human Lab transform output (reference only — not used at build time).
