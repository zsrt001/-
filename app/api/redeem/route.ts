import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics";
import {
  SupabaseAdminError,
  equalsFilter,
  supabaseRest
} from "@/lib/supabaseAdmin";

export type RedeemStatus = "invalid" | "used" | "valid";

type RedeemRequestBody = {
  code?: unknown;
};

type RedeemCodeRow = {
  code: string;
  result_id: string | null;
  status: string;
};

export const runtime = "nodejs";

function normalizeRedeemCode(code: string) {
  return code.trim().toUpperCase();
}

function redeemResponse(status: RedeemStatus, init?: ResponseInit) {
  return NextResponse.json({ status }, init);
}

async function getRedeemCode(code: string) {
  const rows = await supabaseRest<RedeemCodeRow[]>("redeem_codes", {
    searchParams: {
      code: equalsFilter(code),
      limit: "1",
      select: "code,status,result_id"
    }
  });

  return rows[0] ?? null;
}

export async function POST(request: Request) {
  let body: RedeemRequestBody;

  try {
    body = (await request.json()) as RedeemRequestBody;
  } catch {
    await trackServerEvent("code_invalid", {
      payload: { reason: "invalid_request" }
    });
    return redeemResponse("invalid");
  }

  if (typeof body.code !== "string") {
    await trackServerEvent("code_invalid", {
      payload: { reason: "missing_code" }
    });
    return redeemResponse("invalid");
  }

  const normalizedCode = normalizeRedeemCode(body.code);

  try {
    const matchedCode = await getRedeemCode(normalizedCode);

    if (!matchedCode) {
      await trackServerEvent("code_invalid", {
        code: normalizedCode,
        payload: { reason: "not_found" }
      });
      return redeemResponse("invalid");
    }

    if (matchedCode.status !== "unused" || matchedCode.result_id) {
      await trackServerEvent("code_used", {
        code: normalizedCode,
        payload: { result_id: matchedCode.result_id }
      });
      return redeemResponse("used");
    }

    await trackServerEvent("code_verified", {
      code: normalizedCode
    });

    return redeemResponse("valid");
  } catch (error) {
    if (
      error instanceof SupabaseAdminError &&
      error.message === "missing_supabase_env"
    ) {
      return redeemResponse("invalid", { status: 500 });
    }

    return redeemResponse("invalid", { status: 500 });
  }
}
