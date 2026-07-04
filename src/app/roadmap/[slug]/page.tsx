import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getRoadmap, type RoadmapStatus } from "@/lib/api";

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  PLANNED: "계획",
  IN_PROGRESS: "진행",
  SUCCEEDED: "성공",
  FAILED: "실패",
  LEARNED: "경험",
};

const STATUS_BADGE: Record<RoadmapStatus, string> = {
  PLANNED: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  IN_PROGRESS: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  SUCCEEDED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  FAILED: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  LEARNED: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getRoadmap(slug);
  if (!item) notFound();

  return (
    <article className="flex flex-col gap-8">
      <Link href="/roadmap" className="text-sm text-zinc-500 hover:underline w-fit">
        ← roadmap
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className={`px-2 py-0.5 rounded ${STATUS_BADGE[item.status]}`}>
            {STATUS_LABEL[item.status]}
          </span>
          {item.period && <span className="text-zinc-500">{item.period}</span>}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
        {item.description && (
          <p className="text-zinc-600 dark:text-zinc-400">{item.description}</p>
        )}
      </header>

      {item.story ? (
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.story}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">아직 회고가 작성되지 않았습니다.</p>
      )}
    </article>
  );
}
