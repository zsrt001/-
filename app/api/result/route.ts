import { NextResponse } from "next/server";
import { type ResultPayload } from "@/lib/calculateResult";
import {
  SupabaseAdminError,
  equalsFilter,
  supabaseRest
} from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type TestResultRow = {
  id: string;
  result_payload: ResultPayload;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function resultError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resultId = searchParams.get("result_id")?.trim();

  if (!resultId || !uuidPattern.test(resultId)) {
    return resultError("invalid_result_id", 400);
  }

  try {
    const rows = await supabaseRest<TestResultRow[]>("test_results", {
      searchParams: {
        id: equalsFilter(resultId),
        limit: "1",
        select: "id,result_payload"
      }
    });

    const result = rows[0]?.result_payload;

    if (!result) {
      return resultError("result_not_found", 404);
    }

    return NextResponse.json({
      result,
      result_id: resultId
    });
  } catch (error) {
    if (
      error instanceof SupabaseAdminError &&
      error.message === "missing_supabase_env"
    ) {
      return resultError("missing_supabase_env", 500);
    }

    return resultError("result_fetch_failed", 500);
  }
}
