"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { EmailCaptureConfig } from "@/lib/appData";
import { isValidEmail } from "@/lib/validation";
import { createTrackingPayload, postTrackingEvent } from "@/lib/tracking";

interface EmailCaptureProps {
  config: EmailCaptureConfig;
  appId: string;
  appName: string;
  webhookUrl: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function EmailCapture({
  config,
  appId,
  appName,
  webhookUrl,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!config.enabled) return null;

  const emailValid = isValidEmail(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid || state === "loading") return;

    setState("loading");
    setErrorMessage("");

    const payload = createTrackingPayload({
      eventType: "email_signup",
      appId,
      appName,
      email: email.trim(),
    });

    const result = await postTrackingEvent(webhookUrl, payload);

    if (result.ok) {
      setState("success");
    } else {
      setState("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card mx-auto max-w-2xl text-center"
        >
          {config.headline && (
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {config.headline}
            </h2>
          )}
          {config.subheadline && (
            <p className="mt-3 text-sm sm:text-base" style={{ color: "var(--muted)" }}>
              {config.subheadline}
            </p>
          )}

          {state === "success" ? (
            <div className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <p className="text-sm font-medium">
                Thanks — we&apos;ll notify you when this launches.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder={config.placeholder || "Enter your email"}
                className="input-field flex-1"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="btn-primary shrink-0 px-8"
                disabled={!emailValid || state === "loading"}
              >
                {state === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  config.buttonText || "Notify Me"
                )}
              </button>
            </form>
          )}

          {state === "error" && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
