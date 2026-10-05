import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen, Building2, Mail } from "lucide-react";
import ContributionsCalendar from "@/components/ContributionsCalendar";
import YearSelector from "@/components/YearSelector";
import { GithubIcon } from "@/components/icons";
import { Chip, SectionHeader } from "@/components/ui";
import { getAbout, getContributions, getPosts } from "@/lib/api";
import { PROJECTS } from "@/lib/projects";

const EARLIEST_YEAR = 2020;
const LATEST_POSTS_COUNT = 3;
const FEATURED_PROJECTS_COUNT = 3;

const COMPANY_LOGOS: Record<string, string> = {
  "(주)유엑스엔": "/logos/uxn.jpg",
  "상상스토리(주)": "/logos/sangs.jpg",
};

const SKILL_GROUPS: { key: string; label: string }[] = [
  { key: "language", label: "Language" },
  { key: "framework", label: "Framework" },
  { key: "database", label: "Database" },
  { key: "infra", label: "Infra" },
];

const PROFILE_IMG = "/img/profile.jpg";
const hasProfileImg = fs.existsSync(path.join(process.cwd(), "public", PROFILE_IMG));

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
  const [contributions, posts, about] = await Promise.all([
    getContributions(year).catch(() => null),
    getPosts().catch(() => []),
    getAbout().catch(() => null),
  ]);

  const profile = about?.profile;
  const contacts = profile?.contacts;
  const careers = [...(about?.careers ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const latestPosts = posts.slice(0, LATEST_POSTS_COUNT);
  const featured = PROJECTS.slice(0, FEATURED_PROJECTS_COUNT);

  const stats = [
    { label: "경력", value: profile?.careerPeriod ?? "-" },
    { label: "프로젝트", value: `${PROJECTS.length}개` },
    { label: `${year ?? new Date().getFullYear()} 기여`, value: contributions ? `${contributions.totalCount}회` : "-" },
    { label: "작성한 글", value: `${posts.length}편` },
  ];

  return (
    <div className="flex flex-col gap-28 py-6">
      {/* Hero */}
      <section className="animate-fade-up flex flex-col-reverse sm:flex-row sm:items-center gap-10 sm:gap-16 pt-8">
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {profile?.isEmployed && (
            <span className="self-start inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              재직중 · {profile.careerPeriod}
            </span>
          )}
          <div className="flex flex-col gap-3">
            <p className="text-lg text-muted">안녕하세요, {profile?.name ?? "WonJun"}입니다.</p>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.15] bg-gradient-to-br from-foreground via-foreground to-accent-2 bg-clip-text text-transparent">
              {profile?.tagline ?? "백엔드 개발자"}
            </h1>
          </div>
          {profile?.intro && (
            <p className="text-base sm:text-lg leading-relaxed text-muted max-w-2xl line-clamp-3">
              {profile.intro}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent-strong text-foreground font-bold px-5 py-2.5 text-sm font-semibold hover:opacity-85 transition-opacity"
              >
                <Mail className="size-4" />
                연락하기
              </a>
            )}
            {contacts?.githubPersonal && (
              <a
                href={contacts.githubPersonal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            )}
            {contacts?.velog && (
              <a
                href={contacts.velog}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                <BookOpen className="size-4" />
                Velog
              </a>
            )}
          </div>
        </div>
        <div className="shrink-0 size-40 sm:size-60 rounded-3xl overflow-hidden border border-line bg-surface flex items-center justify-center">
          {hasProfileImg ? (
            <Image src={PROFILE_IMG} alt={profile?.name ?? "WonJun"} width={416} height={416} className="size-full object-cover object-[center_30%]" />
          ) : (
            <span className="text-5xl sm:text-7xl font-bold tracking-tight text-muted/40">WJ</span>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="animate-fade-up [animation-delay:100ms] grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-accent-2">{s.value}</span>
            <span className="text-sm text-muted">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Tech stack */}
      {about?.skills && (
        <section className="animate-fade-up [animation-delay:200ms] flex flex-col gap-8">
          <SectionHeader eyebrow="Tech Stack" title="다루는 기술" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {SKILL_GROUPS.filter((g) => about.skills[g.key]?.length).map((g) => (
              <div key={g.key} className="flex flex-col gap-3">
                <span className="text-sm font-semibold">{g.label}</span>
                <div className="flex flex-wrap gap-2">
                  {about.skills[g.key].map((s) => (
                    <Chip key={s.name}>{s.name}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects — 벤토 그리드: 첫 카드는 크게 */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Projects" title="만든 것들" href="/projects" linkLabel="전체 보기" />
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
          {featured.map((p, i) => {
            const isHero = i === 0;
            const visual = p.thumbnail ?? p.logo;
            return (
              <Link
                key={p.slug}
                href="/projects"
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 ${
                  isHero ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                {visual && (
                  <div className={`relative bg-background border-b border-line overflow-hidden ${isHero ? "aspect-[16/9]" : "aspect-[16/7]"}`}>
                    <Image
                      src={visual}
                      alt={p.title}
                      fill
                      unoptimized
                      className={`${p.thumbnail ? "object-cover object-top" : "object-contain p-6"} transition-transform duration-500 group-hover:scale-[1.03]`}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3 p-6 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>{p.period}</span>
                    {p.status === "live" && (
                      <span className="rounded-full bg-accent-soft text-accent-2 px-2 py-0.5 font-semibold">LIVE</span>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className={`${isHero ? "text-2xl" : "text-lg"} font-bold tracking-tight`}>{p.title}</h3>
                      <p className="text-sm text-muted">{p.subtitle}</p>
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 text-muted transition-all group-hover:text-accent-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {p.stack.slice(0, isHero ? 6 : 3).map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Experience — 타임라인 */}
      {careers.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionHeader eyebrow="Experience" title="경력" href="/about" linkLabel="이력서 보기" />
          <ol className="relative flex flex-col gap-4">
            {careers.map((c) => {
              const logo = COMPANY_LOGOS[c.company];
              return (
                <li key={c.company + c.period} className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 size-12 rounded-xl bg-white border border-line flex items-center justify-center overflow-hidden p-1.5">
                      {logo ? (
                        <Image src={logo} alt={c.company} width={96} height={96} unoptimized className="size-full object-contain" />
                      ) : (
                        <Building2 className="size-6 text-muted" />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 flex-1 min-w-0">
                      <div className="flex flex-col gap-0.5">
                        <h3 className="text-lg font-bold tracking-tight">{c.company}</h3>
                        <span className="text-sm text-muted">
                          {[c.role, c.position].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-muted shrink-0 flex items-center gap-2">
                        {c.isCurrent && <span className="size-1.5 rounded-full bg-accent" />}
                        {c.period}
                      </span>
                    </div>
                  </div>
                  {c.summary && <p className="text-base leading-relaxed">{c.summary}</p>}
                  {c.projects && c.projects.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {c.projects.map((proj) => (
                        <details key={proj.title} className="group rounded-2xl border border-line bg-background open:bg-background">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                            <span className="font-semibold text-sm sm:text-base">{proj.title}</span>
                            <span className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:inline text-xs font-mono text-muted">{proj.period}</span>
                              <ArrowRight className="size-4 text-muted transition-transform group-open:rotate-90" />
                            </span>
                          </summary>
                          <ul className="flex flex-col gap-2 px-5 pb-5 text-sm text-muted">
                            {proj.details.map((d) => (
                              <li key={d} className="relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent">
                                {d}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                    </div>
                  )}
                  {c.stack && c.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.stack.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Activity — 글 + 잔디 */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Activity" title="기록하고 꾸준히" href="/log" linkLabel="모든 글" />
        {latestPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/log/${encodeURIComponent(post.slug)}`}
                className="group flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/40"
              >
                <span className="text-xs font-mono text-muted">{post.publishedAt?.slice(0, 10) ?? ""}</span>
                <h3 className="font-bold tracking-tight leading-snug line-clamp-2 group-hover:text-accent-2 transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && <p className="text-sm text-muted line-clamp-3">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
        {contributions && (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">GitHub Contributions</span>
              <YearSelector years={availableYears()} />
            </div>
            <ContributionsCalendar days={contributions.days} totalCount={contributions.totalCount} />
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="rounded-3xl border border-line bg-surface px-6 py-14 sm:py-20 flex flex-col items-center text-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">Contact</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">함께 이야기 나눠요</h2>
        <p className="text-muted max-w-md">궁금한 점이나 제안이 있다면 편하게 연락 주세요.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent-strong text-foreground font-bold px-6 py-3 text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              <Mail className="size-4" />
              {profile.email}
            </a>
          )}
          {contacts?.githubWork && (
            <a
              href={contacts.githubWork}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold hover:bg-surface-hover transition-colors"
            >
              <GithubIcon className="size-4" />
              GitHub (회사)
            </a>
          )}
        </div>
      </section>

      <footer className="text-center text-sm text-muted pb-4">
        © {new Date().getFullYear()} WonJun. All rights reserved.
      </footer>
    </div>
  );
}
