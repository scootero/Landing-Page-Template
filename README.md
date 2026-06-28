# iOS App Validation Landing Page Template

A premium, config-driven Next.js landing page template for validating iOS app ideas. Swap content, images, themes, mockup URLs, and tracking webhooks via `app-data/` — no code edits required. Designed for automation with n8n.

## What This Template Does

This template powers **fake-door validation** for iOS app concepts. It presents a polished, Apple-inspired landing page with:

- Live embedded app mockup (iframe)
- Benefit, feature, and screenshot sections
- Pricing with purchase-intent tracking
- Email capture and FAQ
- Configurable themes and accent colors

All content comes from `app-data/app-config.json`. n8n can replace config, images, and webhook URLs for each new app idea.

## Folder Structure

```
app/
  layout.tsx          # Root layout, fonts, theme provider
  page.tsx            # Main landing page composition
  globals.css         # Global styles, glass utilities
components/
  Header.tsx
  Hero.tsx
  LiveMockupEmbed.tsx
  BenefitGrid.tsx
  ProblemSolution.tsx
  FeatureSection.tsx
  ScreenshotGallery.tsx
  HowItWorks.tsx
  PricingSection.tsx
  BuyNowTracker.tsx
  EmailCapture.tsx
  FAQSection.tsx
  TestimonialSection.tsx
  Footer.tsx
  ThemeProvider.tsx
lib/
  appData.ts          # Config types and loaders
  validation.ts       # Email validation
  tracking.ts         # Webhook payload helpers
  themes.ts           # Theme system
app-data/
  app-config.json     # All app-specific content
  images/             # Screenshot images (1.png – 4.png)
public/               # Static assets (images copied here on dev/build)
scripts/
  copy-app-data-images.js
  generate-placeholder-images.js
```

## Editing app-config.json

All app-specific content lives in `app-data/app-config.json`:

| Field | Purpose |
|-------|---------|
| `appId`, `appName` | Identity for tracking |
| `heroHeadline`, `heroSubheadline` | Hero copy |
| `benefits`, `features`, `screenshots` | Section content |
| `problem`, `solution`, `targetAudience` | Problem/solution block |
| `theme` | Visual style (see below) |
| `mockup.embedUrl` | Deployed mockup app URL |
| `pricing`, `emailCapture`, `faq` | Optional sections (`enabled: true/false`) |
| `tracking` | Webhook URLs |

Set `enabled: false` on optional sections to hide them. Missing arrays or strings won't crash the page.

## Replacing Images

1. Drop PNG/JPG files into `app-data/images/` (e.g. `1.png`, `2.png`, `3.png`, `4.png`)
2. Reference them in config: `"image": "/app-data/images/1.png"`
3. On `npm run dev` or `npm run build`, images are copied to `public/app-data/images/`

To generate placeholder images:

```bash
node scripts/generate-placeholder-images.js
```

## Setting the Mockup URL

In `app-config.json`:

```json
"mockup": {
  "embedUrl": "https://your-mockup-app.vercel.app",
  "baseWidth": 375,
  "baseHeight": 820,
  "useOuterDeviceFrame": false
}
```

The mockup app is deployed separately and controls its own iPhone UI. Set `useOuterDeviceFrame: false` (default) to avoid double-framing. The landing page only wraps the iframe with a subtle glow/shadow.

## Theme Styles

Configure in `app-config.json`:

```json
"theme": {
  "style": "liquid-glass",
  "accentColor": "violet",
  "mode": "light"
}
```

**Available styles:**

| Style | Description |
|-------|-------------|
| `liquid-glass` | Frosted panels, soft glow (default) |
| `apple-light` | Clean white/gray Apple aesthetic |
| `apple-dark` | Dark gray, high contrast |
| `midnight` | Deep navy gradient |
| `aurora` | Purple/teal gradient |
| `black-titanium` | Near-black metallic |
| `minimal-white` | Ultra-clean minimal |

**Accent colors:** `violet`, `blue`, `emerald`, `rose`, `amber`, `cyan`

## Buy Now Tracking

The pricing section uses fake-door validation:

1. User enters a valid email
2. Buy Now button enables
3. On click, POST to `tracking.buyNowWebhookUrl`
4. Success message shown (no redirect to App Store)

If no webhook URL is configured, events are logged to the console in development and success UI is still shown for local testing.

## Webhook Payloads

### Buy Now Click

```json
{
  "eventType": "buy_now_click",
  "appId": "example-app",
  "appName": "Example App",
  "email": "user@example.com",
  "price": "$4.99",
  "pageUrl": "https://yoursite.com/?utm_source=twitter",
  "utmSource": "twitter",
  "utmMedium": "",
  "utmCampaign": "",
  "utmContent": "",
  "timestamp": "2025-06-25T12:00:00.000Z"
}
```

### Email Signup

```json
{
  "eventType": "email_signup",
  "appId": "example-app",
  "appName": "Example App",
  "email": "user@example.com",
  "price": "",
  "pageUrl": "https://yoursite.com/",
  "utmSource": "",
  "utmMedium": "",
  "utmCampaign": "",
  "utmContent": "",
  "timestamp": "2025-06-25T12:00:00.000Z"
}
```

UTM parameters are read automatically from the page URL.

## n8n Automation

n8n should replace these files per app idea:

1. **`app-data/app-config.json`** — full config with copy, theme, pricing, webhooks
2. **`app-data/images/`** — 1–4 screenshot PNGs
3. **`mockup.embedUrl`** — URL of the deployed mockup app
4. **`tracking.buyNowWebhookUrl`** — n8n webhook for purchase intent
5. **`tracking.emailWebhookUrl`** — n8n webhook for email signups

After replacement, redeploy to Vercel (or run locally). No code changes needed.

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Framework preset: **Next.js**
4. Build command: `npm run build` (default)
5. Deploy

Environment variables are optional. Webhook URLs go in `app-config.json`, not env vars.

## Commands

```bash
npm install
npm run dev
npm run build
```

- `npm run dev` — copies images, starts dev server at http://localhost:3000
- `npm run build` — copies images, builds for production
- `npm start` — runs production server locally
