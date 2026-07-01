# Landing page images

Screenshot and logo files referenced by `app-config.json` are copied to `public/app-data/images/` on `npm run dev` and `npm run build`.

## Human Lab (expected files)

| File | Source in App Package |
|------|------------------------|
| `01-home.png` | `test-app-packages/human-lab/media/screenshots/01-home.png` |
| `02-feature.png` | `test-app-packages/human-lab/media/screenshots/02-feature.png` |
| `03-results.png` | `test-app-packages/human-lab/media/screenshots/03-results.png` |
| `logo.png` | `test-app-packages/human-lab/media/logo.png` (optional) |

Until PNGs exist in this folder, the screenshot gallery shows placeholder cards. Regenerate config from the App Package with:

```bash
node scripts/generate-app-config.js ../test-app-packages/human-lab
```
