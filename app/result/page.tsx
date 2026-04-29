import { ResultFlow } from "@/components/result/result-flow";

type ResultPageProps = {
  searchParams?: Promise<{
    result_id?: string;
  }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;

  return <ResultFlow resultId={params?.result_id} />;
}
