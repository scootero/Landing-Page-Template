"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { AppConfig } from "@/lib/appData";
import { getSafeBenefits } from "@/lib/appData";
import LiveMockupEmbed from "./LiveMockupEmbed";

interface HeroProps {
  config: AppConfig;
}

export default function Hero({ config }: HeroProps) {
  const benefits = getSafeBenefits(config).slice(0, 3);

  return (
    <section className="section-padding overflow-hidden">
      <div className="section-container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1 lg:order-1"
          >
            {config.badgeText && (
              <span className="badge mb-6">{config.badgeText}</span>
            )}

            {config.heroHeadline && (
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {config.heroHeadline}
              </h1>
            )}

            {config.heroSubheadline && (
              <p className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--muted)" }}>
                {config.heroSubheadline}
              </p>
            )}

            {benefits.length > 0 && (
              <ul className="mt-8 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-center gap-3 text-sm sm:text-base">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                        color: "var(--accent)",
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{benefit.title}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#pricing" className="btn-primary">
                {config.primaryCtaText}
              </a>
              <a href="#screenshots" className="btn-secondary">
                {config.secondaryCtaText}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="order-2 flex justify-center lg:order-2"
            id="live-mockup"
          >
            <LiveMockupEmbed mockup={config.mockup} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
