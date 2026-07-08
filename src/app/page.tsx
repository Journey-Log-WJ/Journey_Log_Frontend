import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import Image from "next/image";
import { Mail, Rss, BookOpen, Building2, User, MapPin } from "lucide-react";
import ContributionsCalendar from "@/components/ContributionsCalendar";
import YearSelector from "@/components/YearSelector";
import RoadmapPreview from "@/components/RoadmapPreview";
import { getAbout, getContributions, getPosts, getRoadmaps } from "@/lib/api";

const EARLIEST_YEAR = 2020;
const HIGHLIGHT_ROADMAP_SLUGS = ["kernel-academy", "uxn-join", "skku-master"];
const LATEST_POSTS_COUNT = 3;

const COMPANY_LOGOS: Record<string, string> = {
  "(주)유엑스엔": "/logos/uxn.jpg",
  "상상스토리(주)": "/logos/sangs.jpg",
};

type CareerPhase = { title: string; period: string; bullets: string[] };

const COMPANY_DETAILS: Record<string, CareerPhase[]> = {
  "상상스토리(주)": [
    {
      title: "사내 포털 및 접근권한 관리 시스템 개발",
      period: "2022.05 ~ 2023.08",
      bullets: [
        "eGovFramework 기반 포털 시스템 신규 구축",
        "Spring Security 활용 RBAC 기반 권한 관리 및 인증 시스템 설계·구현",
        "시큐어 코딩 가이드 적용 및 보안 강화",
        "Docker 기반 사내 서버 운영 환경 구축 및 최적화",
      ],
    },
    {
      title: "LMS 및 시설물 관리 시스템 고도화",
      period: "2023.08 ~ 2024.04",
      bullets: [
        "법무부 솔로몬로 포탈, LMS, 시설물 관리 시스템 개발 및 성능 최적화",
        "웹 접근성 WAX Scanner 70 → 90점 개선 (KWCAG 인증 획득)",
        "SQL Injection, XSS 등 보안 취약점 60건 전수 점검·개선",
        "N+1 문제 해결을 위한 쿼리 튜닝",
        "RESTful API 설계 및 로그/통계 대시보드 구현",
        "서버 관리 자동화 및 장애 대응 프로세스 체계화",
      ],
    },
  ],
};

const PROFILE_IMG = "/img/profile.jpg";
const hasProfileImg = fs.existsSync(path.join(process.cwd(), "public", PROFILE_IMG));

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.72-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.71 21.4 24 17.09 24 12 24 5.65 18.85.5 12 .5z" />
    </svg>
  );
}

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
  const careers = [...(about?.careers ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
        <div className="shrink-0 size-32 sm:size-36 rounded-full overflow-hidden bg-[#f5ede0] dark:bg-[#3d2f22] border-4 border-[#8B5A2B]/25 shadow-sm flex items-center justify-center">
          {hasProfileImg ? (
            <Image
              src={PROFILE_IMG}
              alt="WonJun"
              width={144}
              height={144}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="size-14 text-[#8B5A2B]/40 dark:text-[#D4A574]/40" strokeWidth={1.4} />
          )}
        </div>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight text-[#8B5A2B] dark:text-[#D4A574]">
          WonJun
        </h1>
      </section>

      {highlights.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold uppercase tracking-widest text-[#8B5A2B] dark:text-[#B08D57]">
              Journey
            </h2>
            <Link href="/roadmap" className="text-xs text-stone-600 hover:text-[#8B5A2B] dark:hover:text-[#D4A574]">
              전체 로드맵 →
            </Link>
          </div>
          <RoadmapPreview items={highlights} />
        </section>
      )}

      {contributions && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold uppercase tracking-widest text-[#8B5A2B] dark:text-[#B08D57]">
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
            <h2 className="text-base font-semibold uppercase tracking-widest text-[#8B5A2B] dark:text-[#B08D57]">
              Latest posts
            </h2>
            <Link href="/log" className="text-xs text-stone-600 hover:text-[#8B5A2B] dark:hover:text-[#D4A574]">
              모두 보기 →
            </Link>
          </div>
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/log/${encodeURIComponent(post.slug)}`}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 hover:text-rose-600 dark:hover:text-rose-400"
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

      {careers.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-base font-semibold uppercase tracking-widest text-[#8B5A2B] dark:text-[#B08D57]">
            Career
          </h2>
          <div className="flex flex-col gap-8">
            {careers.map((c) => {
              const logo = COMPANY_LOGOS[c.company];
              return (
                <div key={c.company + c.period} className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:items-start">
                  <div className="shrink-0 w-48 h-24 rounded-lg overflow-hidden bg-white dark:bg-white border border-[#8B5A2B]/20 flex items-center justify-center p-3">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={c.company}
                        width={700}
                        height={280}
                        unoptimized
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                      />
                    ) : (
                      <Building2 className="size-10 text-[#8B5A2B]/60" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-2xl font-semibold tracking-tight">{c.company}</h3>
                      {c.role && (
                        <span className="text-base text-stone-600 dark:text-stone-400">{c.role}</span>
                      )}
                      {c.position && (
                        <span className="text-sm text-stone-500">{c.position}</span>
                      )}
                    </div>
                    <div className="text-sm font-mono text-stone-500">{c.period}</div>
                    {c.summary && (
                      <p className="text-base text-stone-700 dark:text-stone-300 mt-1">
                        {c.summary}
                      </p>
                    )}
                    {COMPANY_DETAILS[c.company] && (
                      <div className="mt-4 flex flex-col gap-4">
                        {COMPANY_DETAILS[c.company].map((phase) => (
                          <div key={phase.title} className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <h4 className="text-base font-semibold text-[#8B5A2B] dark:text-[#D4A574]">
                                {phase.title}
                              </h4>
                              <span className="text-xs font-mono text-stone-500">{phase.period}</span>
                            </div>
                            <ul className="flex flex-col gap-1 text-sm text-stone-700 dark:text-stone-300">
                              {phase.bullets.map((b) => (
                                <li
                                  key={b}
                                  className="pl-4 relative before:content-['·'] before:absolute before:left-1 before:text-[#8B5A2B] dark:before:text-[#D4A574]"
                                >
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {c.stack && c.stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {c.stack.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-1 rounded-full bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#D4A574]/10 dark:text-[#D4A574]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {contacts && (
        <section className="pt-14 mt-4 border-t border-[#8B5A2B]/20 flex flex-col gap-8">
          <h2 className="text-base font-semibold uppercase tracking-widest text-[#8B5A2B] dark:text-[#B08D57]">
            Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
            <a
              href={`mailto:${about?.profile.email}`}
              className="group flex items-start gap-4"
            >
              <Mail className="size-8 shrink-0 mt-0.5 text-[#8B5A2B] dark:text-[#D4A574]" strokeWidth={1.5} />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-base font-semibold">이메일</span>
                <span className="text-sm text-stone-600 dark:text-stone-400 truncate group-hover:text-[#8B5A2B] dark:group-hover:text-[#D4A574]">
                  {about?.profile.email}
                </span>
              </div>
            </a>

            {about?.profile.region && (
              <div className="flex items-start gap-4">
                <MapPin className="size-8 shrink-0 mt-0.5 text-[#8B5A2B] dark:text-[#D4A574]" strokeWidth={1.5} />
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold">주소</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400">
                    경기도 시흥시 은행동
                  </span>
                </div>
              </div>
            )}

            {contacts.githubPersonal && (
              <a
                href={contacts.githubPersonal}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4"
              >
                <GithubIcon className="size-8 shrink-0 mt-0.5 text-[#8B5A2B] dark:text-[#D4A574]" />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base font-semibold">GitHub (개인)</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400 truncate group-hover:text-[#8B5A2B] dark:group-hover:text-[#D4A574]">
                    @{contacts.githubPersonal.replace(/^https?:\/\/github\.com\//, "")}
                  </span>
                </div>
              </a>
            )}

            {contacts.githubWork && (
              <a
                href={contacts.githubWork}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4"
              >
                <GithubIcon className="size-8 shrink-0 mt-0.5 text-[#8B5A2B] dark:text-[#D4A574]" />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base font-semibold">GitHub (회사)</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400 truncate group-hover:text-[#8B5A2B] dark:group-hover:text-[#D4A574]">
                    @{contacts.githubWork.replace(/^https?:\/\/github\.com\//, "")}
                  </span>
                </div>
              </a>
            )}

            {contacts.velog && (
              <a
                href={contacts.velog}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4"
              >
                <BookOpen className="size-8 shrink-0 mt-0.5 text-[#8B5A2B] dark:text-[#D4A574]" strokeWidth={1.5} />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base font-semibold">Velog</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400 truncate group-hover:text-[#8B5A2B] dark:group-hover:text-[#D4A574]">
                    {contacts.velog.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </div>
              </a>
            )}

            {contacts.blog && (
              <a
                href={contacts.blog}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4"
              >
                <Rss className="size-8 shrink-0 mt-0.5 text-[#8B5A2B] dark:text-[#D4A574]" strokeWidth={1.5} />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base font-semibold">Blog</span>
                  <span className="text-sm text-stone-600 dark:text-stone-400 truncate group-hover:text-[#8B5A2B] dark:group-hover:text-[#D4A574]">
                    {contacts.blog.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </span>
                </div>
              </a>
            )}
          </div>

          <div className="pt-6 mt-2 border-t border-[#8B5A2B]/10 text-center text-base text-stone-500">
            © {new Date().getFullYear()}. WonJun. All rights reserved.
          </div>
        </section>
      )}
    </div>
  );
}
