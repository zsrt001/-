import { type AnalyticsEventName } from "@/lib/analyticsEvents";
import { supabaseRest } from "@/lib/supabaseAdmin";

type TrackEventOptions = {
  code?: string | null;
  payload?: Record<string, unknown> | null;
};

export async function trackServerEvent(
  eventName: AnalyticsEventName,
  options: TrackEventOptions = {}
) {
  try {
    await supabaseRest<null>("events", {
      body: {
        code: options.code ?? null,
        event_name: eventName,
        payload: options.payload ?? null
      },
      method: "POST",
      prefer: "return=minimal"
    });
  } catch {
    // Analytics must never block the user's main flow.
  }
}
