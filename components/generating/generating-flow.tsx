"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, AtlasCard, GoldButton, SealMark } from "@/components/ui";
import { trackClientEvent } from "@/lib/clientAnalytics";

type SubmitResponse = {
  result_id?: string;
  result?: unknown;
  error?: string;
};

const generatingSteps = [
  "你的答案正在归入山海图……",
  "性格原型正在生成……",
  "图鉴结果即将完成……"
];

const stepDuration = 900;
const redirectDelay = 2700;

function readSessionPayload() {
  const code = sessionStorage.getItem("soul-atlas-redeem-code");
  const answersText = sessionStorage.getItem("soul-atlas-answers");

  if (!code || !answersText) {
    return null;
  }

  try {
    return {
      code,
      answers: JSON.parse(answersText) as Record<string, string>
    };
  } catch {
    return null;
  }
}

export function GeneratingFlow() {
  const router = useRouter();
  const timersRef = useRef<number[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const submitResult = useCallback(async () => {
    clearTimers();
    setStepIndex(0);
    setHasError(false);
    setIsSubmitting(true);

    const payload = readSessionPayload();

    if (!payload) {
      setHasError(true);
      setIsSubmitting(false);
      return;
    }

    trackClientEvent("result_generating", {
      code: payload.code,
      payload: {
        answers_count: Object.keys(payload.answers).length
      }
    });

    timersRef.current.push(
      window.setTimeout(() => setStepIndex(1), stepDuration),
      window.setTimeout(() => setStepIndex(2), stepDuration * 2)
    );

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("submit_failed");
      }

      const data = (await response.json()) as SubmitResponse;

      if (!data.result_id) {
        throw new Error("missing_result_id");
      }

      sessionStorage.setItem("soul-atlas-result-id", data.result_id);

      if (data.result) {
        sessionStorage.setItem(
          "soul-atlas-result-payload",
          JSON.stringify(data.result)
        );
      }

      timersRef.current.push(
        window.setTimeout(() => {
          router.push(`/result?result_id=${encodeURIComponent(data.result_id!)}`);
        }, redirectDelay)
      );
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  }, [clearTimers, router]);

  useEffect(() => {
    void submitResult();

    return clearTimers;
  }, [clearTimers, submitResult]);

  return (
    <AppShell accent="#b28d59" glowColor="rgba(178, 141, 89, 0.11)">
      <div className="generating-page">
        <AtlasCard className="generating-card p-6">
          <div className="generating-orbit" aria-hidden="true">
            <span className="generating-orbit__ring" />
            <span className="generating-orbit__ring generating-orbit__ring--inner" />
            <span className="generating-orbit__star generating-orbit__star--one" />
            <span className="generating-orbit__star generating-orbit__star--two" />
            <SealMark label="鉴" className="generating-orbit__seal" />
          </div>

          <div className="generating-copy">
            <p className="title-slip">人格图鉴生成中</p>
            <h1>{generatingSteps[stepIndex]}</h1>
            <p>你的专属人格图鉴已生成后，将自动进入结果页。</p>
          </div>

          {hasError && (
            <div className="generating-retry">
              <p>提交暂时失败，请确认已完成答题后重试。</p>
              <GoldButton disabled={isSubmitting} onClick={submitResult}>
                重试
              </GoldButton>
            </div>
          )}
        </AtlasCard>
      </div>
    </AppShell>
  );
}
