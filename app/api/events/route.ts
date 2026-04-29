import { NextResponse } from "next/server";
import { isAnalyticsEventName } from "@/lib/analyticsEvents";
import { trackServerEvent } from "@/lib/analytics";

export const runtime = "nodejs";

type EventsRequestBody = {
  code?: unknown;
  event_name?: unknown;
  payload?: unknown;
};

function isPlainPayload(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function POST(request: Request) {
  let body: EventsRequestBody;

  try {
    body = (await request.json()) as EventsRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (
    typeof body.event_name !== "string" ||
    !isAnalyticsEventName(body.event_name)
  ) {
    return NextResponse.json({ error: "invalid_event_name" }, { status: 400 });
  }

  await trackServerEvent(body.event_name, {
    code: typeof body.code === "string" ? body.code.trim().toUpperCase() : null,
    payload: isPlainPayload(body.payload) ? body.payload : null
  });

  return NextResponse.json({ ok: true });
}
