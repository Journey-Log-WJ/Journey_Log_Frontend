import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { getPosts, getSeriesList } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { PageHeader, SectionHeader, TagList } from "@/components/ui";

export default async function LogPage() {
  const [seriesList, posts] = await Promise.all([getSeriesList(), getPosts()]);

  return (
    <div className="flex flex-col gap-20 py-6">
      <PageHeader eyebrow="Log" title="기록" description="Velog와 노션에서 모은 글이에요." />

      {seriesList.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionHeader eyebrow="Series" title="시리즈" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seriesList.map((series) => (
              <Link
                key={series.id}
                href={`/series/${series.slug}`}
                className="group flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft">
                    <Layers className="size-5 text-accent-2" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted transition-all group-hover:text-accent-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">{series.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>{series.postsCount}개 글</span>
                  {series.updatedAt && (
                    <>
                      <span>·</span>
                      <span>{formatDate(series.updatedAt)} 업데이트</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="All Posts" title={`전체 글 ${posts.length}`} />
        {posts.length === 0 ? (
          <p className="text-muted">아직 글이 없습니다.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/log/${post.slug}`}
                  className="group grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-2 sm:gap-6 py-6"
                >
                  <time className="text-sm font-mono text-muted pt-0.5">{formatDate(post.publishedAt)}</time>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold tracking-tight group-hover:text-accent-2 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-sm text-muted line-clamp-2">{post.excerpt}</p>}
                    <TagList tags={post.tags} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
