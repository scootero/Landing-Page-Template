import rawConfig from "@/app-data/app-config.json";

export interface ThemeConfig {
  style: string;
  accentColor: string;
  mode: string;
}

export interface LogoConfig {
  text: string;
  imageUrl: string;
}

export interface MockupConfig {
  embedUrl: string;
  baseWidth: number;
  baseHeight: number;
  useOuterDeviceFrame: boolean;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Screenshot {
  title: string;
  description: string;
  image: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
}

export interface HowItWorksConfig {
  enabled: boolean;
  steps: HowItWorksStep[];
}

export interface PricingConfig {
  enabled: boolean;
  price: string;
  billingLabel: string;
  ctaText: string;
  finePrint: string;
}

export interface EmailCaptureConfig {
  enabled: boolean;
  headline: string;
  subheadline: string;
  placeholder: string;
  buttonText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQConfig {
  enabled: boolean;
  items: FAQItem[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
}

export interface TestimonialsConfig {
  enabled: boolean;
  items: TestimonialItem[];
}

export interface TrackingConfig {
  buyNowWebhookUrl: string;
  emailWebhookUrl: string;
}

export interface AppConfig {
  appId: string;
  appName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  badgeText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  theme: ThemeConfig;
  logo: LogoConfig;
  mockup: MockupConfig;
  problem: string;
  solution: string;
  targetAudience: string;
  benefits: Benefit[];
  features: Feature[];
  screenshots: Screenshot[];
  howItWorks: HowItWorksConfig;
  pricing: PricingConfig;
  emailCapture: EmailCaptureConfig;
  faq: FAQConfig;
  testimonials: TestimonialsConfig;
  tracking: TrackingConfig;
}

const defaults: AppConfig = {
  appId: "app",
  appName: "App",
  tagline: "",
  heroHeadline: "",
  heroSubheadline: "",
  badgeText: "",
  primaryCtaText: "Get Early Access",
  secondaryCtaText: "Learn More",
  theme: { style: "liquid-glass", accentColor: "violet", mode: "light" },
  logo: { text: "A", imageUrl: "" },
  mockup: {
    embedUrl: "",
    baseWidth: 375,
    baseHeight: 820,
    useOuterDeviceFrame: false,
  },
  problem: "",
  solution: "",
  targetAudience: "",
  benefits: [],
  features: [],
  screenshots: [],
  howItWorks: { enabled: false, steps: [] },
  pricing: {
    enabled: false,
    price: "",
    billingLabel: "",
    ctaText: "Buy Now",
    finePrint: "",
  },
  emailCapture: {
    enabled: false,
    headline: "",
    subheadline: "",
    placeholder: "Enter your email",
    buttonText: "Notify Me",
  },
  faq: { enabled: false, items: [] },
  testimonials: { enabled: false, items: [] },
  tracking: { buyNowWebhookUrl: "", emailWebhookUrl: "" },
};

function mergeConfig(partial: Partial<AppConfig>): AppConfig {
  return {
    ...defaults,
    ...partial,
    theme: { ...defaults.theme, ...partial.theme },
    logo: { ...defaults.logo, ...partial.logo },
    mockup: { ...defaults.mockup, ...partial.mockup },
    howItWorks: { ...defaults.howItWorks, ...partial.howItWorks },
    pricing: { ...defaults.pricing, ...partial.pricing },
    emailCapture: { ...defaults.emailCapture, ...partial.emailCapture },
    faq: { ...defaults.faq, ...partial.faq },
    testimonials: { ...defaults.testimonials, ...partial.testimonials },
    tracking: { ...defaults.tracking, ...partial.tracking },
    benefits: partial.benefits ?? defaults.benefits,
    features: partial.features ?? defaults.features,
    screenshots: partial.screenshots ?? defaults.screenshots,
  };
}

export function getAppConfig(): AppConfig {
  return mergeConfig(rawConfig as Partial<AppConfig>);
}

export function getSafeBenefits(config: AppConfig): Benefit[] {
  return (config.benefits ?? []).filter((b) => b?.title);
}

export function getSafeFeatures(config: AppConfig): Feature[] {
  return (config.features ?? []).filter((f) => f?.title);
}

export function getSafeScreenshots(config: AppConfig): Screenshot[] {
  return (config.screenshots ?? []).filter((s) => s?.title).slice(0, 4);
}

export function getSafeFAQItems(config: AppConfig): FAQItem[] {
  return (config.faq?.items ?? []).filter((item) => item?.question);
}

export function getSafeTestimonials(config: AppConfig): TestimonialItem[] {
  return (config.testimonials?.items ?? []).filter((t) => t?.quote);
}

export function getSafeHowItWorksSteps(config: AppConfig): HowItWorksStep[] {
  return (config.howItWorks?.steps ?? []).filter((s) => s?.title);
}
