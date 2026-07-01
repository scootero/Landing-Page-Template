# App Package → app-config.json transform

This document describes how n8n (or `scripts/generate-app-config.js`) maps an [App Package](../../app-validation-spec/APP_PACKAGE_SPEC.md) into `app-data/app-config.json` for the landing template.

The transform **translates package data only** — it must not contain app-specific content.

## Run locally

From `landing-template/`:

```bash
node scripts/generate-app-config.js ../test-app-packages/human-lab
npm run dev
```

## Input files

| App Package path | Used for |
|------------------|----------|
| `app.json` | Identity, audience, commerce, branding, media paths, sections, webhooks, deployment URLs |
| `copy/hero.md` | `heroHeadline`, `heroSubheadline`, `heroBody` |
| `copy/benefits.md` | `benefits[]` |
| `copy/features.md` | `features[]` |
| `copy/faq.md` | `faq.items[]` |
| `media/screenshots/*.png` | Copied to `app-data/images/`; paths in `screenshots[].image` |
| `media/logo.png` | Copied to `app-data/images/logo.png` |
| `media/og-image.png` | Copied to `app-data/images/og-image.png` when present |

## Output

| Output | Purpose |
|--------|---------|
| `app-data/app-config.json` | Consumed by `lib/appData.ts` and all landing components |
| `app-data/images/*` | Copied screenshots, logo, and OG image (when binaries exist) |

## Field mapping reference

| app.json / copy | app-config.json |
|-----------------|-----------------|
| `appId` | `appId` |
| `identity.appName` | `appName` |
| `identity.tagline` | `tagline` |
| `identity.badgeText` | `badgeText` |
| `copy/hero.md` Headline | `heroHeadline` (fallback: `identity.tagline`) |
| `copy/hero.md` Subheadline | `heroSubheadline` (fallback: truncated `identity.description`) |
| `copy/hero.md` Body | `heroBody` |
| `commerce.cta.primaryText` | `primaryCtaText` |
| `commerce.cta.secondaryText` | `secondaryCtaText` |
| `commerce.cta.buyNowText` | `pricing.ctaText` |
| `commerce.cta.waitlistText` | `emailCapture.buttonText` |
| `commerce.cta.emailPlaceholder` or `landingPage.sections[cta].inline.placeholder` | `emailCapture.placeholder` |
| `commerce.pricing` | `pricing.price`, `pricing.billingLabel` |
| `audience.painPoints[0]` | `problem` |
| `identity.description` | `solution` |
| `audience.landingPhrase` | `targetAudience` (fallback: `audience.primary`) |
| `branding.theme.landingStyle` | `theme.style` (fallback: `midnight` if dark, else `liquid-glass`) |
| `branding.theme.accentName` | `theme.accentColor` (fallback: hex map, then `violet`) |
| `branding.theme.mode` | `theme.mode` |
| `copy/benefits.md` | `benefits[]` |
| `copy/features.md` | `features[]` |
| `media.screenshots[]` | `screenshots[]` |
| `landingPage.sections[pricing]` | `pricing.finePrint`, `pricing.enabled` |
| `landingPage.sections[cta]` | `emailCapture.headline`, `emailCapture.subheadline`, `emailCapture.enabled` |
| `landingPage.sections[faq]` | `faq.enabled` |
| `landingPage.sections[socialProof]` | `testimonials.enabled` |
| `landingPage.sections[footer].inline.body` | `footer.text` |
| `landingPage.seo` | `seo.title`, `seo.description`, `seo.keywords` |
| `media.ogImage.path` (when file exists) | `seo.ogImageUrl` |
| `mockup.baseWidth`, `baseHeight`, `clipBottomPx` | `mockup.*` |
| `deployment.mockupUrl` or `mockup.previewUrl` | `mockup.embedUrl` |
| `tracking.webhooks.emailCaptured` | `tracking.emailWebhookUrl` |
| `tracking.webhooks.buyNowClicked` | `tracking.buyNowWebhookUrl` |

## Generic transform fallbacks (not app-specific)

Used only when the package omits the field:

| app-config field | Fallback |
|------------------|----------|
| `badgeText` | `"Coming soon to the App Store"` if `platform === "ios"`, else `"Coming soon"` |
| `theme.style` | `"midnight"` if `mode === "dark"`, else `"liquid-glass"` |
| `theme.accentColor` | Hex → name map, then `"violet"` |
| `mockup.baseWidth` / `baseHeight` | `375` / `820` |
| `mockup.clipBottomPx` | `0` |
| `emailCapture.placeholder` | `"Enter your email"` |
| `emailCapture.buttonText` | `"Notify Me"` |
| `pricing.headlineLabel` | `"Get for"` |
| `logo.text` | First letter of `appName` |
| `howItWorks` | `{ enabled: false, steps: [] }` |
| `benefits` | `[]` when `copy/benefits.md` missing |

## Not mapped (remaining gaps)

| Spec | Landing template |
|------|-------------------|
| `tracking.webhooks.validationComplete` | n8n-only |
| `tracking.webhooks.deployComplete` | n8n-only |
| `landingPage.sections[socialProof].inline` | Headline/body not mapped when testimonials enabled |
| `copy/how-it-works.md` | No parser yet; `howItWorks` stays disabled |
| `copy/testimonials.md` | No parser yet; `testimonials.items` stays empty |
| `branding.theme.fontFamily` | Not applied in landing CSS yet |

## n8n workflow (future)

1. Read App Package from Drive
2. Run equivalent transform → write `app-config.json`
3. Copy `media/screenshots/*`, logo, and og-image into landing repo `app-data/images/`
4. After mockup deploy, set `mockup.embedUrl` from `deployment.mockupUrl`
5. After webhook provisioning, set `tracking.*WebhookUrl` from `tracking.webhooks.*`
6. Deploy landing-template to Vercel

The landing page **never** imports mockup source—only `mockup.embedUrl`.
