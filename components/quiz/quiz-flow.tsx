"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppShell,
  AtlasCard,
  OptionButton,
  SealMark,
  SoftDivider,
  StarProgress
} from "@/components/ui";
import { questions, type QuestionOptionId } from "@/data/questions";
import { getChapterTheme } from "@/lib/chapterTheme";
import { trackClientEvent } from "@/lib/clientAnalytics";

type QuizFlowProps = {
  initialQuestionIndex?: number;
};

const totalQuestions = questions.length;
const nextQuestionDelay = 300;

function getStoredAnswers() {
  try {
    return JSON.parse(
      sessionStorage.getItem("soul-atlas-answers") ?? "{}"
    ) as Record<string, QuestionOptionId>;
  } catch {
    return {};
  }
}

export function QuizFlow({ initialQuestionIndex = 0 }: QuizFlowProps) {
  const router = useRouter();
  const hasTrackedStartRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(initialQuestionIndex);
  const [selectedOptionId, setSelectedOptionId] =
    useState<QuestionOptionId | null>(null);

  const question = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;
  const theme = useMemo(
    () => getChapterTheme(currentQuestionIndex),
    [currentQuestionIndex]
  );
  const isAnswering = selectedOptionId !== null;

  useEffect(() => {
    if (initialQuestionIndex === 0) {
      sessionStorage.removeItem("soul-atlas-answers");
    }
  }, [initialQuestionIndex]);

  useEffect(() => {
    if (initialQuestionIndex === 0 && !hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      trackClientEvent("quiz_started", {
        payload: {
          total_questions: totalQuestions
        }
      });
    }
  }, [initialQuestionIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSelect = useCallback(
    (optionId: QuestionOptionId) => {
      if (selectedOptionId) {
        return;
      }

      setSelectedOptionId(optionId);
      sessionStorage.setItem(
        "soul-atlas-answers",
        JSON.stringify({
          ...getStoredAnswers(),
          [questionNumber]: optionId
        })
      );
      trackClientEvent("question_answered", {
        payload: {
          chapter: question.chapter,
          option_id: optionId,
          question_id: question.id,
          question_number: questionNumber
        }
      });

      timerRef.current = window.setTimeout(() => {
        if (currentQuestionIndex >= totalQuestions - 1) {
          trackClientEvent("quiz_completed", {
            payload: {
              total_questions: totalQuestions
            }
          });
          router.push("/generating");
          return;
        }

        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedOptionId(null);
        router.replace(`/quiz?q=${nextIndex + 1}`, { scroll: false });
      }, nextQuestionDelay);
    },
    [
      currentQuestionIndex,
      question.chapter,
      question.id,
      questionNumber,
      router,
      selectedOptionId
    ]
  );

  return (
    <AppShell accent={theme.accentColor} glowColor={theme.glowColor}>
      <div className="quiz-flow">
        <AtlasCard className="quiz-card p-5">
          <div className="quiz-question-panel" key={question.id}>
            <header className="quiz-header">
              <div className="quiz-header__main">
                <div className="quiz-chapter-icon">
                  <SealMark accent={theme.accentColor} label={theme.icon} />
                </div>
                <div>
                  <p className="quiz-count">
                    第 {questionNumber} / {totalQuestions} 问
                  </p>
                  <h1 className="quiz-chapter-name">{theme.chapterName}</h1>
                </div>
              </div>

              <p className="quiz-stage-title">
                <span>{question.stage}</span>
                <i aria-hidden="true">｜</i>
                <strong>{question.title}</strong>
              </p>
            </header>

            <SoftDivider className="my-5" />

            <StarProgress
              label="十二道故事题"
              total={totalQuestions}
              value={questionNumber}
            />

            <div className="quiz-scene">
              <p>{question.scene}</p>
            </div>

            <div className="quiz-options">
              {question.options.map((option, index) => (
                <OptionButton
                  disabled={isAnswering}
                  index={index}
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  selected={selectedOptionId === option.id}
                >
                  {option.text}
                </OptionButton>
              ))}
            </div>
          </div>
        </AtlasCard>
      </div>
    </AppShell>
  );
}
