import Image from "next/image";
import { ExternalLink } from "lucide-react";

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

type Repo = { label: string; url: string };

type Project = {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  repos: Repo[];
  thumbnail?: string;
  logo?: string;
  pinned?: boolean;
  status: "live" | "local";
  device: "mobile" | "laptop";
};

const PROJECTS: Project[] = [
  {
    slug: "gotcha",
    title: "GOTCHA",
    subtitle: "지도 기반 제보·커뮤니티 서비스",
    period: "2026.01 ~ 진행중",
    role: "풀스택",
    highlights: [
      "지도 기반 UX + 바텀시트 인터랙션",
      "제보 시스템, 신고/차단 기능",
      "Web Push 알림, 카카오 OAuth2 연동/해제",
      "GitHub Actions CI/CD + Vercel 배포",
      "Critical CSS · 폰트 · preconnect 성능 최적화",
    ],
    stack: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL", "카카오맵", "Vercel"],
    liveUrl: "https://gotcha.it.com/",
    repos: [
      { label: "Frontend", url: "https://github.com/WONJUN-KR/GOTCHA-Frontend" },
      { label: "Backend", url: "https://github.com/WONJUN-KR/GOTCHA-Backend" },
    ],
    thumbnail: "/projects/gotcha.png",
    pinned: true,
    status: "live",
    device: "laptop",
  },
  {
    slug: "ai-auto-posting",
    title: "AI Auto Posting (OCP)",
    subtitle: "AI 콘텐츠 자동 생성 플랫폼",
    period: "2025.11 ~ 2025.12",
    role: "풀스택",
    highlights: [
      "RabbitMQ 비동기 처리 환경 백엔드 API 개발",
      "관리자 통계 API, 일별 포스팅 자동 집계 스케줄러",
      "블로그 플랫폼별 발행 통계 조회 API",
      "관리자 대시보드 차트 개선 + 통계 테이블 페이징",
    ],
    stack: ["Java 21", "Spring Boot 3.x", "JPA", "React", "RabbitMQ", "PostgreSQL"],
    repos: [
      { label: "Frontend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Frontend" },
      { label: "Backend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Backend" },
    ],
    logo: "/projects/ocp.png",
    status: "local",
    device: "laptop",
  },
  {
    slug: "cos-house",
    title: "Co's House",
    subtitle: "오늘의 집 벤치마킹 커머스 (5인 팀)",
    period: "2025.09 ~ 2025.10",
    role: "백엔드",
    highlights: [
      "마이페이지·주문 관리·상품 검색 기능 담당",
      "댓글 시스템 구현",
      "Spring Data JPA 기반 REST API 설계",
    ],
    stack: ["Java 21", "Spring Boot 3.x", "JPA", "MySQL", "TypeScript"],
    repos: [{ label: "Repo", url: "https://github.com/WONJUN-KR/Co-s_House" }],
    logo: "/projects/coshouse.png",
    status: "local",
    device: "laptop",
  },
];

function LaptopFrame({ children, fixedAspect = true }: { children: React.ReactNode; fixedAspect?: boolean }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-t-xl border border-[#8B5A2B]/25 bg-[#f5ede0] dark:bg-[#3d2f22] overflow-hidden shadow-md">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#8B5A2B]/15">
          <span className="size-2.5 rounded-full bg-[#e07b39]" />
          <span className="size-2.5 rounded-full bg-[#D4A574]" />
          <span className="size-2.5 rounded-full bg-[#7ea862]" />
        </div>
        <div
          className={
            fixedAspect
              ? "aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-[#f5ede0] to-[#d4a574]/30 dark:from-[#3d2f22] dark:to-[#2a2016]"
              : "bg-white"
          }
        >
          {children}
        </div>
      </div>
      <div className="mx-auto h-1.5 w-1/2 rounded-b-md bg-[#8B5A2B]/25" />
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[240px] mx-auto">
      <div className="rounded-[2rem] border-[6px] border-[#2a2016] dark:border-[#3d2f22] bg-[#f5ede0] dark:bg-[#2a2016] overflow-hidden shadow-lg">
        <div className="aspect-[9/16] relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Placeholder({ title, logo }: { title: string; logo?: string }) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={title}
        width={200}
        height={200}
        unoptimized
        className="w-1/2 max-w-[180px] h-auto"
      />
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 text-[#8B5A2B]/70 dark:text-[#D4A574]/70">
      <span className="font-mono text-xs uppercase tracking-widest">preview</span>
      <span className="text-2xl font-semibold tracking-tight text-center px-4">{title}</span>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.thumbnail) {
    if (project.device === "mobile") {
      return (
        <MobileFrame>
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            unoptimized
            className="object-cover"
          />
        </MobileFrame>
      );
    }
    return (
      <LaptopFrame fixedAspect={false}>
        <Image
          src={project.thumbnail}
          alt={project.title}
          width={501}
          height={279}
          unoptimized
          className="w-full h-auto block"
        />
      </LaptopFrame>
    );
  }
  if (project.logo) {
    return (
      <LaptopFrame>
        <div className="w-full h-full bg-white flex items-center justify-center">
          <Image
            src={project.logo}
            alt={project.title}
            width={800}
            height={800}
            unoptimized
            className="w-full h-full object-contain p-4"
          />
        </div>
      </LaptopFrame>
    );
  }
  const Frame = project.device === "mobile" ? MobileFrame : LaptopFrame;
  return (
    <Frame>
      <Placeholder title={project.title} />
    </Frame>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#8B5A2B] dark:text-[#D4A574]">
          Projects
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-400">
          만든 것들. 배포된 것은 라이브로, 아직 로컬인 것은 목업으로.
        </p>
      </section>

      <div className="flex flex-col gap-20">
        {PROJECTS.map((p) => (
          <article
            key={p.slug}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <ProjectVisual project={p} />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
                  {p.pinned && (
                    <>
                      <span className="inline-flex items-center gap-1 text-[#8B5A2B] dark:text-[#D4A574] font-semibold">
                        📌 고정됨
                      </span>
                      <span>·</span>
                    </>
                  )}
                  <span>{p.period}</span>
                  <span>·</span>
                  <span>{p.role}</span>
                  {p.status === "live" && (
                    <>
                      <span>·</span>
                      <span className="text-[#7ea862] font-semibold">LIVE</span>
                    </>
                  )}
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">{p.title}</h2>
                <p className="text-base text-stone-600 dark:text-stone-400">{p.subtitle}</p>
              </div>

              <ul className="flex flex-col gap-1.5 text-sm text-stone-700 dark:text-stone-300">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="pl-4 relative before:content-['·'] before:absolute before:left-1 before:text-[#8B5A2B] dark:before:text-[#D4A574]"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 pt-1">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#D4A574]/10 dark:text-[#D4A574]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5A2B] text-[#f5ede0] hover:bg-[#B08D57] text-sm font-semibold"
                  >
                    라이브 보기
                    <ExternalLink className="size-4" />
                  </a>
                )}
                {p.repos.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#8B5A2B]/30 text-[#8B5A2B] dark:text-[#D4A574] hover:bg-[#8B5A2B]/5 text-sm font-semibold"
                  >
                    <GithubIcon className="size-4" />
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
