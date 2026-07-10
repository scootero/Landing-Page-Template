# Landing page images

PNG/JPG files referenced by `app-config.json` are copied to `public/app-data/images/` on `npm run dev` and `npm run build`.

## Production

WF2 reads Drive `app.json` only, resolves declared `media.url` or `media.githubPath` assets from `source.assetsGithubRepo ?? source.mockupGithubRepo`, and stages the downloaded binaries in `app-data/images/`. The landing-template prebuild mirrors them here during Vercel build. Production WF2 never reads a Drive `media/` folder.

## Local dev

Regenerate from an App Package:

```bash
node scripts/generate-app-config.js ../test-app-packages/human-lab
npm run dev
```

See `app-config.example.json` for a full Human Lab transform output (reference only — not used at build time).
