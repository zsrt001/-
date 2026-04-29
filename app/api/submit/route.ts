import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  calculateResult,
  type AnswerMap,
  type ResultPayload
} from "@/lib/calculateResult";
import { type QuestionOptionId } from "@/data/questions";
import { trackServerEvent } from "@/lib/analytics";
import {
  SupabaseAdminError,
  equalsFilter,
  supabaseRest
} from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type SubmitRequestBody = {
  code?: unknown;
  answers?: unknown;
};

type RedeemCodeRow = {
  code: string;
  result_id: string | null;
  status: string;
};

const validOptionIds = new Set<QuestionOptionId>(["A", "B", "C", "D"]);

function normalizeSubmitCode(code: string) {
  return code.trim().toUpperCase();
}

function submitError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function normalizeAnswers(value: unknown): AnswerMap | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const rawAnswers = value as Record<string, unknown>;
  const answers: Partial<AnswerMap> = {};

  for (let questionId = 1; questionId <= 12; questionId += 1) {
    const optionId = rawAnswers[String(questionId)];

    if (
      typeof optionId !== "string" ||
      !validOptionIds.has(optionId as QuestionOptionId)
    ) {
      return null;
    }

    answers[questionId] = optionId as QuestionOptionId;
  }

  return answers as AnswerMap;
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

async function reserveRedeemCode(
  code: string,
  resultId: string,
  usedAt: string
) {
  const rows = await supabaseRest<RedeemCodeRow[]>("redeem_codes", {
    body: {
      result_id: resultId,
      status: "used",
      used_at: usedAt
    },
    method: "PATCH",
    prefer: "return=representation",
    searchParams: {
      code: equalsFilter(code),
      select: "code,status,result_id",
      status: "eq.unused"
    }
  });

  return rows.length > 0;
}

async function releaseRedeemCode(code: string, resultId: string) {
  await supabaseRest<null>("redeem_codes", {
    body: {
      result_id: null,
      status: "unused",
      used_at: null
    },
    method: "PATCH",
    prefer: "return=minimal",
    searchParams: {
      code: equalsFilter(code),
      result_id: equalsFilter(resultId)
    }
  });
}

async function insertTestResult(
  code: string,
  answers: AnswerMap,
  result: ResultPayload,
  resultId: string,
  createdAt: string
) {
  await supabaseRest<null>("test_results", {
    body: {
      answers,
      code,
      created_at: createdAt,
      id: resultId,
      result_payload: result
    },
    method: "POST",
    prefer: "return=minimal"
  });
}

export async function POST(request: Request) {
  let body: SubmitRequestBody;

  try {
    body = (await request.json()) as SubmitRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (typeof body.code !== "string" || !body.code.trim()) {
    return submitError("missing_code", 400);
  }

  const answers = normalizeAnswers(body.answers);

  if (!answers) {
    return submitError("invalid_answers", 400);
  }

  const code = normalizeSubmitCode(body.code);

  try {
    const redeemCode = await getRedeemCode(code);

    if (!redeemCode) {
      await trackServerEvent("code_invalid", {
        code,
        payload: { source: "submit", reason: "not_found" }
      });
      return submitError("invalid_code", 404);
    }

    if (redeemCode.status !== "unused") {
      await trackServerEvent("code_used", {
        code,
        payload: { source: "submit", result_id: redeemCode.result_id }
      });
      return submitError("used_code", 409);
    }

    const createdAt = new Date().toISOString();
    const resultId = randomUUID();
    const result = calculateResult(answers);
    const reserved = await reserveRedeemCode(code, resultId, createdAt);

    if (!reserved) {
      await trackServerEvent("code_used", {
        code,
        payload: { source: "submit", reason: "already_reserved" }
      });
      return submitError("used_code", 409);
    }

    try {
      await insertTestResult(code, answers, result, resultId, createdAt);
    } catch (error) {
      await releaseRedeemCode(code, resultId).catch(() => undefined);
      throw error;
    }

    return NextResponse.json({ result_id: resultId });
  } catch (error) {
    if (
      error instanceof SupabaseAdminError &&
      error.message === "missing_supabase_env"
    ) {
      return submitError("missing_supabase_env", 500);
    }

    return submitError("submit_failed", 500);
  }
}
