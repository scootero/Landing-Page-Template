"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { StoreCtaButton } from "./StoreCta";
import { isValidEmail } from "@/lib/validation";
import { createTrackingPayload, postTrackingEvent } from "@/lib/tracking";

interface BuyNowTrackerProps {
  appId: string;
  appName: string;
  price: string;
  ctaText: string;
  webhookUrl: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function BuyNowTracker({
  appId,
  appName,
  price,
  ctaText,
  webhookUrl,
}: BuyNowTrackerProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const emailValid = isValidEmail(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid || state === "loading") return;

    setState("loading");
    setErrorMessage("");

    const payload = createTrackingPayload({
      eventType: "buy_now_click",
      appId,
      appName,
      email: email.trim(),
      price,
    });

    const result = await postTrackingEvent(webhookUrl, payload);

    if (result.ok) {
      setState("success");
    } else {
      setState("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
        <p className="text-sm font-medium">
          Thanks — we&apos;ll notify you when this launches.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        placeholder="Enter your email"
        className="input-field"
        aria-label="Email address"
        required
      />

      {state === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <StoreCtaButton loading={state === "loading"} disabled={!emailValid}>
        {ctaText}
      </StoreCtaButton>
    </form>
  );
}
