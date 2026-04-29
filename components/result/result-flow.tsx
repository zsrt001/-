"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  AppShell,
  AtlasCard,
  GoldButton,
  SealMark,
  SoftDivider
} from "@/components/ui";
import { type ResultPayload } from "@/lib/calculateResult";
import { trackClientEvent } from "@/lib/clientAnalytics";

type ResultResponse = {
  result?: ResultPayload;
  result_id?: string;
  error?: string;
};

type ResultFlowProps = {
  resultId?: string;
};

const resultBlocks: Array<{
  key: keyof Pick<
    ResultPayload,
    "portrait" | "blindspot" | "relationship" | "growthTask"
  >;
  title: string;
}> = [
  { key: "portrait", title: "性格画像" },
  { key: "blindspot", title: "隐藏性格倾向" },
  { key: "relationship", title: "关系模式提示" },
  { key: "growthTask", title: "成长课题建议" }
];

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function ResultFlow({ resultId }: ResultFlowProps) {
  const hasTrackedViewRef = useRef(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchResult = useCallback(async () => {
    if (!resultId) {
      setError("缺少结果编号，请重新完成测试。");
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/result?result_id=${encodeURIComponent(resultId)}`,
        { cache: "no-store" }
      );
      const data = (await response.json()) as ResultResponse;

      if (!response.ok || !data.result) {
        throw new Error(data.error ?? "result_fetch_failed");
      }

      setResult(data.result);

      if (!hasTrackedViewRef.current) {
        hasTrackedViewRef.current = true;
        trackClientEvent("result_viewed", {
          payload: {
            archetype: data.result.archetype,
            rarity: data.result.rarity,
            result_id: resultId
          }
        });
      }
    } catch {
      setError("图鉴结果暂时没有显影，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }, [resultId]);

  const handleSaveShareCard = useCallback(async () => {
    if (!shareCardRef.current || !result) {
      return;
    }

    setIsSaving(true);

    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });

      downloadDataUrl(dataUrl, `灵魂图鉴-${result.archetype}.png`);
      trackClientEvent("share_card_saved", {
        payload: {
          archetype: result.archetype,
          rarity: result.rarity,
          result_id: resultId
        }
      });
    } finally {
      setIsSaving(false);
    }
  }, [result, resultId]);

  useEffect(() => {
    void fetchResult();
  }, [fetchResult]);

  return (
    <AppShell accent="#c4a35d" glowColor="rgba(196, 163, 93, 0.16)">
      <div className="result-page">
        {isLoading && (
          <AtlasCard className="result-state-card p-6">
            <p className="title-slip">人格图鉴读取中</p>
            <h1>正在读取你的东方性格原型……</h1>
          </AtlasCard>
        )}

        {!isLoading && error && (
          <AtlasCard className="result-state-card p-6">
            <p className="title-slip">图鉴未成</p>
            <h1>{error}</h1>
            <GoldButton className="mt-5" onClick={fetchResult}>
              重新读取
            </GoldButton>
          </AtlasCard>
        )}

        {!isLoading && result && (
          <>
            <AtlasCard className="result-hero-card p-5">
              <div className="result-hero-card__top">
                <p className="title-slip">你的东方性格原型</p>
                <SealMark label="鉴" />
              </div>
              <h1>{result.archetype}</h1>
              <div className="result-meta-row">
                <span>{result.rarity}</span>
                <span>{result.subtype}</span>
              </div>
              <p className="ancient-label mt-5">图鉴判词</p>
              <p className="result-quote">{result.quote}</p>
            </AtlasCard>

            <AtlasCard className="p-5">
              <p className="ancient-label">三大性格特质</p>
              <div className="result-tags mt-4">
                {result.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </AtlasCard>

            {resultBlocks.map((block) => (
              <AtlasCard className="p-5" key={block.key}>
                <p className="ancient-label">{block.title}</p>
                <p className="ancient-copy mt-3">{result[block.key]}</p>
              </AtlasCard>
            ))}

            <AtlasCard className="p-5">
              <div className="result-share-head">
                <div>
                  <p className="ancient-label">专属图鉴卡</p>
                  <p className="ancient-copy mt-1">9:16 竖版人格图鉴卡</p>
                </div>
                <GoldButton
                  className="result-save-button"
                  disabled={isSaving}
                  onClick={handleSaveShareCard}
                >
                  {isSaving ? "生成中" : "保存PNG"}
                </GoldButton>
              </div>

              <div className="result-share-frame">
                <div className="share-card" ref={shareCardRef}>
                  <div className="share-card__veil" />
                  <div className="share-card__inner">
                    <div className="share-card__top">
                      <span>灵魂图鉴</span>
                      <SealMark label="鉴" />
                    </div>

                    <div className="share-card__main">
                      <p>东方意象性格测试</p>
                      <h2>{result.archetype}</h2>
                      <SoftDivider />
                      <blockquote>{result.quote}</blockquote>
                    </div>

                    <div className="share-card__tags">
                      {result.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>

                    <div className="share-card__bottom">
                      <span>{result.rarity}</span>
                      <p>{result.cardText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AtlasCard>
          </>
        )}
      </div>
    </AppShell>
  );
}
