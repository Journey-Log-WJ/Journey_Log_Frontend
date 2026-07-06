import Link from "next/link";
import ContributionsCalendar from "@/components/ContributionsCalendar";
import YearSelector from "@/components/YearSelector";
import RoadmapPreview from "@/components/RoadmapPreview";
import { getAbout, getContributions, getPosts, getRoadmaps } from "@/lib/api";

const EARLIEST_YEAR = 2020;
const HIGHLIGHT_ROADMAP_SLUGS = ["kernel-academy", "uxn-join", "skku-master"];
const LATEST_POSTS_COUNT = 3;

function availableYears(): number[] {
  const now = new Date().getFullYear();
  const years: number[] = [];
  for (let y = now; y >= EARLIEST_YEAR; y--) years.push(y);
  return years;
}

type PageProps = {
  searchParams: Promise<{ year?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { year } = await searchParams;
  const [contributions, roadmaps, posts, about] = await Promise.all([
    getContributions(year).catch(() => null),
    getRoadmaps().catch(() => []),
    getPosts().catch(() => []),
    getAbout().catch(() => null),
  ]);

  const highlights = HIGHLIGHT_ROADMAP_SLUGS
    .map((slug) => roadmaps.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const latestPosts = posts.slice(0, LATEST_POSTS_COUNT);
  const contacts = about?.profile.contacts;

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">원준</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          백엔드 개발자. 만든 것·배운 것·앞으로 갈 곳을 기록으로 남깁니다.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/about" className="underline underline-offset-4 hover:text-zinc-950 dark:hover:text-zinc-50">
            이력서 보기
          </Link>
          <Link href="/log" className="underline underline-offset-4 hover:text-zinc-950 dark:hover:text-zinc-50">
            글 보기
          </Link>
          <Link href="/roadmap" className="underline underline-offset-4 hover:text-zinc-950 dark:hover:text-zinc-50">
            로드맵 보기
          </Link>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Journey
            </h2>
            <Link href="/roadmap" className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">
              전체 로드맵 →
            </Link>
          </div>
          <RoadmapPreview items={highlights} />
        </section>
      )}

      {contributions && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Contributions
            </h2>
            <YearSelector years={availableYears()} />
          </div>
          <ContributionsCalendar
            days={contributions.days}
            totalCount={contributions.totalCount}
          />
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
              Latest posts
            </h2>
            <Link href="/log" className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">
              모두 보기 →
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/log/${encodeURIComponent(post.slug)}`}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 hover:text-zinc-950 dark:hover:text-zinc-50"
                >
                  <span className="font-medium tracking-tight">{post.title}</span>
                  <span className="text-xs font-mono text-zinc-500 shrink-0">
                    {post.publishedAt?.slice(0, 10) ?? ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {contacts && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Contact
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <a href={`mailto:${about?.profile.email}`} className="hover:text-zinc-950 dark:hover:text-zinc-50">
              {about?.profile.email}
            </a>
            {contacts.githubPersonal && (
              <a href={contacts.githubPersonal} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-zinc-50">
                GitHub (개인)
              </a>
            )}
            {contacts.githubWork && (
              <a href={contacts.githubWork} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-zinc-50">
                GitHub (회사)
              </a>
            )}
            {contacts.velog && (
              <a href={contacts.velog} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-zinc-50">
                Velog
              </a>
            )}
            {contacts.blog && (
              <a href={contacts.blog} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-zinc-50">
                Blog
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
