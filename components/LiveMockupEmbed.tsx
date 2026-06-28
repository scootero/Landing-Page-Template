"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone } from "lucide-react";
import type { MockupConfig } from "@/lib/appData";

interface LiveMockupEmbedProps {
  mockup: MockupConfig;
}

export default function LiveMockupEmbed({ mockup }: LiveMockupEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const baseWidth = mockup.baseWidth || 375;
  const baseHeight = mockup.baseHeight || 820;
  const embedUrl = mockup.embedUrl?.trim();
  const useFrame = mockup.useOuterDeviceFrame ?? false;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const available = container.clientWidth;
      const maxScale = 1;
      const minScale = 0.55;
      const computed = Math.min(maxScale, available / baseWidth);
      setScale(Math.max(minScale, computed));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [baseWidth]);

  if (!embedUrl) {
    return (
      <div className="glass-card flex aspect-[375/820] w-full max-w-[375px] flex-col items-center justify-center text-center">
        <div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            color: "var(--accent)",
          }}
        >
          <Smartphone className="h-8 w-8" />
        </div>
        <p className="text-sm font-medium">Live preview coming soon</p>
        <p className="mt-2 max-w-[220px] text-xs" style={{ color: "var(--muted)" }}>
          Add your deployed mockup URL to app-config.json
        </p>
      </div>
    );
  }

  const wrapperStyle = {
    width: baseWidth * scale,
    height: baseHeight * scale,
  };

  const innerStyle = {
    width: baseWidth,
    height: baseHeight,
    transform: `scale(${scale})`,
    transformOrigin: "top left" as const,
  };

  return (
    <div ref={containerRef} className="w-full max-w-[420px]">
      <div
        className="relative mx-auto"
        style={wrapperStyle}
      >
        <div
          className={
            useFrame
              ? "rounded-[3rem] border-[10px] border-neutral-900 bg-neutral-900 p-1 shadow-2xl"
              : "rounded-[2rem] shadow-glow"
          }
          style={
            !useFrame
              ? { boxShadow: "0 0 60px var(--accent-glow), 0 20px 60px rgba(0,0,0,0.12)" }
              : undefined
          }
        >
          <div className="overflow-hidden rounded-[1.75rem]" style={innerStyle}>
            <iframe
              src={embedUrl}
              title="Live app preview"
              width={baseWidth}
              height={baseHeight}
              className="block border-0 bg-transparent"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
