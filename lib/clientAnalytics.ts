import {
  isAnalyticsEventName,
  type AnalyticsEventName
} from "@/lib/analyticsEvents";

type TrackClientEventOptions = {
  code?: string | null;
  payload?: Record<string, unknown>;
};

export function getStoredRedeemCode() {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem("soul-atlas-redeem-code");
}

export function trackClientEvent(
  eventName: AnalyticsEventName,
  options: TrackClientEventOptions = {}
) {
  if (typeof window === "undefined" || !isAnalyticsEventName(eventName)) {
    return;
  }

  const body = JSON.stringify({
    code: options.code ?? getStoredRedeemCode(),
    event_name: eventName,
    payload: options.payload ?? null
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/events",
      new Blob([body], { type: "application/json" })
    );
    return;
  }

  void fetch("/api/events", {
    body,
    headers: {
      "Content-Type": "application/json"
    },
    keepalive: true,
    method: "POST"
  }).catch(() => undefined);
}
