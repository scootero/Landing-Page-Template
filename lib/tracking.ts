export interface UtmParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export interface TrackingPayloadInput {
  eventType: string;
  appId: string;
  appName: string;
  email: string;
  price?: string;
}

export interface TrackingPayload extends TrackingPayloadInput {
  pageUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  timestamp: string;
}

export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") {
    return {
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
  };
}

export function createTrackingPayload(
  input: TrackingPayloadInput
): TrackingPayload {
  const utm = getUtmParams();
  return {
    ...input,
    price: input.price ?? "",
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    utmSource: utm.utmSource,
    utmMedium: utm.utmMedium,
    utmCampaign: utm.utmCampaign,
    utmContent: utm.utmContent,
    timestamp: new Date().toISOString(),
  };
}

export async function postTrackingEvent(
  url: string,
  payload: TrackingPayload
): Promise<{ ok: boolean; error?: string }> {
  if (!url || url.trim() === "") {
    if (process.env.NODE_ENV === "development") {
      console.info("[tracking] No webhook URL configured. Event logged:", payload);
    }
    return { ok: true };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: `Request failed (${response.status})` };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false, error: message };
  }
}
