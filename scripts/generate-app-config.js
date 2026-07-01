#!/usr/bin/env node
/**
 * Generate landing-template app-data/app-config.json from an App Package.
 *
 * Usage (from landing-template/):
 *   node scripts/generate-app-config.js <path-to-app-package>
 *   node scripts/generate-app-config.js ../test-app-packages/human-lab
 *
 * Translates package data only — no app-specific content. See APP_PACKAGE_TRANSFORM.md.
 */

const fs = require("fs");
const path = require("path");

const ACCENT_HEX_TO_NAME = {
  "#06d6a0": "emerald",
  "#059669": "emerald",
  "#3b82f6": "blue",
  "#2563eb": "blue",
  "#7c3aed": "violet",
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function extractSection(markdown, heading) {
  const re = new RegExp(
    `## ${heading}\\s*\\n\\n([\\s\\S]*?)(?=\\n## |\\n\\*\\*|\\n---|$)`,
    "i"
  );
  const match = markdown.match(re);
  if (!match) return "";
  const raw = match[1].trim();
  if (heading.toLowerCase() === "body") {
    return raw.replace(/\n\*\*Primary CTA:\*\*[\s\S]*$/, "").trim();
  }
  return raw.split("\n\n")[0].trim();
}

function parseHeroSection(markdown) {
  return {
    headline: extractSection(markdown, "Headline"),
    subheadline: extractSection(markdown, "Subheadline"),
    body: extractSection(markdown, "Body"),
  };
}

function parseFeatures(markdown) {
  const features = [];
  const blocks = markdown.split(/^## Feature \d+\s*$/m).slice(1);
  for (const block of blocks) {
    const titleMatch = block.match(/\*\*Title:\*\*\s*(.+)/);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();
    const rest = block.slice(titleMatch.index + titleMatch[0].length).trim();
    const description = rest.split("\n\n")[0].trim();
    features.push({ title, description });
  }
  return features;
}

function parseBenefits(markdown) {
  const benefits = [];
  const blocks = markdown.split(/^## Benefit \d+\s*$/m).slice(1);
  for (const block of blocks) {
    const titleMatch = block.match(/\*\*Title:\*\*\s*(.+)/);
    if (!titleMatch) continue;
    const title = titleMatch[1].trim();
    const iconMatch = block.match(/\*\*Icon:\*\*\s*(.+)/);
    const icon = iconMatch ? iconMatch[1].trim() : "check";
    const rest = block.slice(titleMatch.index + titleMatch[0].length).trim();
    const afterIcon = iconMatch
      ? rest.slice(rest.indexOf(iconMatch[0]) + iconMatch[0].length).trim()
      : rest;
    const description = afterIcon.split("\n\n")[0].trim();
    benefits.push({ title, description, icon });
  }
  return benefits;
}

function parseFaq(markdown) {
  const items = [];
  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ") && !line.startsWith("## Feature")) {
      const question = line.slice(3).trim();
      i++;
      const answerLines = [];
      while (i < lines.length && !lines[i].startsWith("## ")) {
        if (lines[i].trim()) answerLines.push(lines[i].trim());
        i++;
      }
      if (question && answerLines.length) {
        items.push({ question, answer: answerLines.join(" ") });
      }
      continue;
    }
    i++;
  }
  return items;
}

function getSection(app, id) {
  return (app.landingPage?.sections ?? []).find((s) => s.id === id);
}

function formatPrice(pricing) {
  if (!pricing?.amount) return "";
  const symbol = pricing.currency === "USD" ? "$" : `${pricing.currency} `;
  return `${symbol}${pricing.amount}`;
}

function formatBuyNowCta(cta, price) {
  const base = cta?.buyNowText ?? "Buy it now on the App Store";
  if (!price) return base;
  if (base.includes("{price}")) {
    return base.replace(/\{price\}/g, price);
  }
  if (cta?.buyNowIncludePrice) {
    if (/\bfor\b/i.test(base)) return base;
    return `${base} for ${price}`;
  }
  return base;
}

function pricingHeadlineLabel(app, pricingSection) {
  return (
    app.commerce?.pricing?.headlineLabel ??
    pricingSection?.inline?.headlineLabel ??
    "Get for"
  );
}

function mapAccentColor(app) {
  const accentName = app.branding?.theme?.accentName;
  if (accentName) return accentName.toLowerCase();
  const hex = app.branding?.theme?.accentColor;
  if (!hex) return "violet";
  return ACCENT_HEX_TO_NAME[hex.toLowerCase()] ?? "violet";
}

function mapLandingStyle(app) {
  const landingStyle = app.branding?.theme?.landingStyle;
  if (landingStyle) return landingStyle;
  return app.branding?.theme?.mode === "dark" ? "midnight" : "liquid-glass";
}

function mapBadgeText(app) {
  if (app.identity?.badgeText) return app.identity.badgeText;
  return app.identity?.platform === "ios"
    ? "Coming soon to the App Store"
    : "Coming soon";
}

function mapTargetAudience(app) {
  return (
    app.audience?.landingPhrase ??
    app.audience?.primary ??
    ""
  );
}

function mapSeo(app, packageDir, heroSubheadline) {
  const seo = app.landingPage?.seo ?? {};
  const appName = app.identity?.appName ?? app.appId;
  const ogImagePath = app.media?.ogImage?.path;
  const ogImageSrc = ogImagePath
    ? path.join(packageDir, ogImagePath)
    : "";
  const ogImageUrl =
    ogImagePath && fs.existsSync(ogImageSrc)
      ? "/app-data/images/og-image.png"
      : "";

  return {
    title: seo.title ?? "",
    description: seo.description ?? "",
    keywords: seo.keywords ?? [],
    ogImageUrl,
  };
}

function mapFooter(app) {
  const footerSection = getSection(app, "footer");
  return {
    text: footerSection?.inline?.body ?? "",
  };
}

function screenshotBasename(packagePath) {
  return path.basename(packagePath);
}

function copyPackageImages(app, packageDir, imagesDir) {
  fs.mkdirSync(imagesDir, { recursive: true });
  let copied = 0;

  for (const shot of app.media?.screenshots ?? []) {
    const src = path.join(packageDir, shot.path);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(imagesDir, screenshotBasename(shot.path)));
    copied++;
  }

  const logoPath = app.media?.logo?.path;
  if (logoPath) {
    const src = path.join(packageDir, logoPath);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(imagesDir, "logo.png"));
      copied++;
    }
  }

  const ogImagePath = app.media?.ogImage?.path;
  if (ogImagePath) {
    const src = path.join(packageDir, ogImagePath);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(imagesDir, "og-image.png"));
      copied++;
    }
  }

  return copied;
}

function generateAppConfig(app, packageDir) {
  const heroMd = readText(path.join(packageDir, "copy", "hero.md"));
  const benefitsMd = readText(path.join(packageDir, "copy", "benefits.md"));
  const featuresMd = readText(path.join(packageDir, "copy", "features.md"));
  const faqMd = readText(path.join(packageDir, "copy", "faq.md"));
  const hero = parseHeroSection(heroMd);
  const pricingSection = getSection(app, "pricing");
  const ctaSection = getSection(app, "cta");
  const faqSection = getSection(app, "faq");
  const socialSection = getSection(app, "socialProof");

  const mockupUrl =
    app.deployment?.mockupUrl ||
    app.mockup?.previewUrl ||
    "";

  const features = parseFeatures(featuresMd);
  const benefits = parseBenefits(benefitsMd);
  const faqItems = parseFaq(faqMd);

  const heroSubheadline =
    hero.subheadline || app.identity?.description?.slice(0, 120) || "";

  const screenshots = (app.media?.screenshots ?? []).map((shot) => {
    const srcPath = path.join(packageDir, shot.path ?? "");
    return {
      title: shot.title ?? "",
      description: shot.description ?? "",
      image: `/app-data/images/${screenshotBasename(shot.path)}`,
      sourcePath: shot.path ?? "",
      missing: !fs.existsSync(srcPath),
    };
  });

  return {
    appId: app.appId,
    appName: app.identity?.appName ?? app.appId,
    tagline: app.identity?.tagline ?? "",
    heroHeadline: hero.headline || app.identity?.tagline || "",
    heroSubheadline,
    heroBody: hero.body ?? "",
    badgeText: mapBadgeText(app),
    primaryCtaText: app.commerce?.cta?.primaryText ?? "Get It Now",
    secondaryCtaText: app.commerce?.cta?.secondaryText ?? "Learn More",
    theme: {
      style: mapLandingStyle(app),
      accentColor: mapAccentColor(app),
      mode: app.branding?.theme?.mode ?? "light",
    },
    logo: {
      text: (app.identity?.appName ?? "A").charAt(0),
      imageUrl: fs.existsSync(path.join(packageDir, app.media?.logo?.path ?? ""))
        ? "/app-data/images/logo.png"
        : "",
    },
    mockup: {
      embedUrl: mockupUrl,
      baseWidth: app.mockup?.baseWidth ?? 375,
      baseHeight: app.mockup?.baseHeight ?? 820,
      useOuterDeviceFrame: app.mockup?.useOuterDeviceFrame ?? false,
      clipBottomPx: app.mockup?.clipBottomPx ?? 0,
    },
    problem: app.audience?.painPoints?.[0] ?? "",
    solution: app.identity?.description ?? "",
    targetAudience: mapTargetAudience(app),
    benefits,
    features: features.length ? features : [],
    screenshots,
    howItWorks: { enabled: false, steps: [] },
    pricing: {
      enabled: pricingSection?.enabled !== false,
      headlineLabel: pricingHeadlineLabel(app, pricingSection),
      price: formatPrice(app.commerce?.pricing),
      billingLabel: app.commerce?.pricing?.period?.replace("ly", "") ?? "month",
      ctaText: formatBuyNowCta(app.commerce?.cta, formatPrice(app.commerce?.pricing)),
      finePrint:
        pricingSection?.inline?.subheadline ??
        `${formatPrice(app.commerce?.pricing)}/${app.commerce?.pricing?.period ?? "month"}`,
    },
    emailCapture: {
      enabled: ctaSection?.enabled !== false,
      headline: ctaSection?.inline?.headline ?? "Want launch updates?",
      subheadline: ctaSection?.inline?.subheadline ?? "Join the waitlist.",
      placeholder:
        ctaSection?.inline?.placeholder ??
        app.commerce?.cta?.emailPlaceholder ??
        "Enter your email",
      buttonText: app.commerce?.cta?.waitlistText ?? "Notify Me",
    },
    faq: {
      enabled: faqSection?.enabled !== false,
      items: faqItems,
    },
    testimonials: {
      enabled: socialSection?.enabled === true,
      items: [],
    },
    seo: mapSeo(app, packageDir, heroSubheadline),
    footer: mapFooter(app),
    tracking: {
      buyNowWebhookUrl: app.tracking?.webhooks?.buyNowClicked ?? "",
      emailWebhookUrl: app.tracking?.webhooks?.emailCaptured ?? "",
    },
  };
}

function main() {
  const packageArg = process.argv[2];
  if (!packageArg) {
    console.error("Usage: node scripts/generate-app-config.js <path-to-app-package>");
    process.exit(1);
  }

  const packageDir = path.resolve(process.cwd(), packageArg);
  const appJsonPath = path.join(packageDir, "app.json");
  if (!fs.existsSync(appJsonPath)) {
    console.error(`app.json not found: ${appJsonPath}`);
    process.exit(1);
  }

  const app = readJson(appJsonPath);
  const config = generateAppConfig(app, packageDir);

  const outPath = path.join(process.cwd(), "app-data", "app-config.json");
  fs.writeFileSync(outPath, JSON.stringify(config, null, 2) + "\n");
  console.log(`Wrote ${outPath}`);

  const imagesDir = path.join(process.cwd(), "app-data", "images");
  const copied = copyPackageImages(app, packageDir, imagesDir);
  if (copied > 0) {
    console.log(`Copied ${copied} image(s) to app-data/images/`);
  } else {
    console.log("No image files found in package (config paths still set).");
  }
}

main();
