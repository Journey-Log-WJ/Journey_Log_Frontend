import { notFound } from "next/navigation";
import { getSeries } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { BackLink, Eyebrow } from "@/components/ui";
import SeriesPostList from "./SeriesPostList";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  return (
    <div className="flex flex-col gap-12 py-6">
      <BackLink href="/log" label="기록으로" />

      <header className="animate-fade-up flex flex-col gap-4">
        <Eyebrow>Series</Eyebrow>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{series.name}</h1>
        {series.description && <p className="text-base sm:text-lg text-muted max-w-2xl">{series.description}</p>}
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>{series.postsCount}개 글</span>
          {series.updatedAt && (
            <>
              <span>·</span>
              <span>{formatDate(series.updatedAt)} 업데이트</span>
            </>
          )}
        </div>
      </header>

      <SeriesPostList posts={series.posts} />
    </div>
  );
}
