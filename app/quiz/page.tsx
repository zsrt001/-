import { QuizFlow } from "@/components/quiz/quiz-flow";
import { questions } from "@/data/questions";

type QuizPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
};

const totalQuestions = questions.length;

function getQuestionIndex(q: string | string[] | undefined) {
  const rawValue = Array.isArray(q) ? q[0] : q;
  const parsedValue = Number.parseInt(rawValue ?? "1", 10);
  const questionNumber = Number.isFinite(parsedValue) ? parsedValue : 1;

  return Math.max(0, Math.min(totalQuestions - 1, questionNumber - 1));
}

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const params = await searchParams;

  return <QuizFlow initialQuestionIndex={getQuestionIndex(params?.q)} />;
}
