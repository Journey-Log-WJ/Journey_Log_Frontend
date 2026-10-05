export type Repo = { label: string; url: string };

export type Project = {
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

export const PROJECTS: Project[] = [
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
