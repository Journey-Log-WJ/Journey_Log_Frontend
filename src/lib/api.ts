// 데이터는 백엔드 없이 Next.js 서버에서 직접 가져옴: 글·시리즈 = Velog, 잔디 = GitHub (src/lib/velog.ts, github.ts)
import { contributionAllTime, contributionDays } from "@/lib/github";
import { velogPost, velogPosts, velogSeries, velogSeriesList, type VelogPost } from "@/lib/velog";

export type Tag = {
  id: string;
  name: string;
};

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  tags: Tag[];
};

export type PostDetail = PostListItem & {
  content: string;
  createdAt: string;
  updatedAt: string;
};

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function toTags(tags: string[] | null | undefined): Tag[] {
  return (tags ?? []).filter(Boolean).map((name) => ({ id: name, name }));
}

function toListItem(p: VelogPost): PostListItem {
  return {
    id: p.id,
    slug: p.url_slug,
    title: p.title,
    excerpt: p.short_description || null,
    publishedAt: p.released_at,
    tags: toTags(p.tags),
  };
}

// 최신 글이 위
export async function getPosts(): Promise<PostListItem[]> {
  const posts = await velogPosts();
  return posts
    .map(toListItem)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  const p = await velogPost(decodeSlug(slug));
  if (!p) return null;
  return {
    ...toListItem(p),
    content: p.body ?? "",
    createdAt: p.released_at ?? "",
    updatedAt: p.updated_at ?? p.released_at ?? "",
  };
}

export type SeriesListItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  postsCount: number;
  updatedAt: string | null;
};

export type SeriesPostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  seriesIndex: number | null;
  tags: Tag[];
};

export type SeriesDetail = SeriesListItem & {
  posts: SeriesPostItem[];
};

export async function getSeriesList(): Promise<SeriesListItem[]> {
  const list = await velogSeriesList();
  return list.map((s) => ({
    id: s.id,
    slug: s.url_slug,
    name: s.name,
    description: s.description?.trim() || null,
    postsCount: s.posts_count,
    updatedAt: s.updated_at,
  }));
}

// 시리즈 상세는 id 로만 조회돼서 목록에서 slug → id 를 찾음
export async function getSeries(slug: string): Promise<SeriesDetail | null> {
  const target = (await getSeriesList()).find((s) => s.slug === decodeSlug(slug));
  if (!target) return null;
  const detail = await velogSeries(target.id);
  if (!detail) return null;
  return {
    ...target,
    posts: detail.series_posts
      .map(({ index, post }) => ({ ...toListItem(post), seriesIndex: index }))
      .sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0)),
  };
}

export type RoadmapStatus = "PLANNED" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "LEARNED";

export type RoadmapItem = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  period: string | null;
  story: string | null;
  status: RoadmapStatus;
  targetDate: string | null;
  sortOrder: number;
};

// 연혁(History) 데이터는 src/lib/history.ts 하드코딩 (백엔드 /api/roadmaps 는 더 이상 안 씀)

export type ContributionDay = {
  date: string;
  count: number;
};

export type ContributionsResponse = {
  totalCount: number;
  days: ContributionDay[];
};

// 잔디에 합산하는 GitHub 계정 (개인 + 회사)
export const GITHUB_ACCOUNTS = ["WONJUN-KR", "WonJun-Uxn"];

// 두 계정의 날짜별 기여를 더함 (year 없으면 최근 1년)
export async function getContributions(year?: string): Promise<ContributionsResponse> {
  const perAccount = await Promise.all(GITHUB_ACCOUNTS.map((login) => contributionDays(login, year)));
  const merged = new Map<string, number>();
  for (const days of perAccount) {
    for (const d of days) merged.set(d.date, (merged.get(d.date) ?? 0) + d.count);
  }
  const days = [...merged.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));
  return { totalCount: days.reduce((sum, d) => sum + d.count, 0), days };
}

// GitHub 계정 하나의 가입 이후 전체 기여 합계 - 홈 숫자 카드용
export async function getGithubContributionAllTime(username: string): Promise<number> {
  return contributionAllTime(username);
}

export type SkillLevel = "상" | "중" | "하";
// kind: 같은 분야(백엔드 등) 안의 세부 묶음 - 언어·프레임워크·라이브러리·데이터베이스
export type SkillItem = { name: string; level?: SkillLevel; kind?: string };

export type CareerProject = {
  title: string;
  period: string;
  details: string[];
};

export type CareerItem = {
  company: string;
  position?: string;
  role?: string;
  period: string;
  isCurrent?: boolean;
  region?: string;
  resignReason?: string;
  summary?: string;
  projects?: CareerProject[];
  stack?: string[];
  sortOrder: number;
};

export type EducationItem = {
  school: string;
  department?: string;
  period: string;
  status?: string;
  region?: string;
  gpa?: string;
  projects?: string[];
  sortOrder: number;
};

export type TrainingItem = {
  org: string;
  course: string;
  period: string;
  learned?: string[];
  sortOrder: number;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  acquiredAt: string;
};

export type PortfolioItem = {
  title: string;
  url: string;
  period: string;
  teamSize?: number;
};

export type AboutProfile = {
  name: string;
  tagline: string;
  email: string;
  region: string;
  careerPeriod: string;
  isEmployed: boolean;
  desiredSalary?: string;
  contacts: {
    githubPersonal?: string;
    githubWork?: string;
    velog?: string;
    blog?: string;
  };
  intro: string;
};

export type AboutContent = {
  profile: AboutProfile;
  careers: CareerItem[];
  educations: EducationItem[];
  trainings: TrainingItem[];
  certifications: CertificationItem[];
  skills: Record<string, SkillItem[]>;
  portfolios: PortfolioItem[];
  military?: { status: string; type: string; period: string };
  coverLetter: string;
};
