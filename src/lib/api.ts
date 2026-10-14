const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export type Tag = {
  id: number;
  name: string;
};

export type PostListItem = {
  id: number;
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

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getPosts(): Promise<PostListItem[]> {
  return fetchJson<PostListItem[]>("/api/posts");
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // slug already decoded
  }
  const url = `${API_BASE}/api/posts/${encodeURIComponent(decoded)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return res.json() as Promise<PostDetail>;
}

export type SeriesListItem = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  postsCount: number;
  updatedAt: string | null;
};

export type SeriesPostItem = {
  id: number;
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
  return fetchJson<SeriesListItem[]>("/api/series");
}

export async function getSeries(slug: string): Promise<SeriesDetail | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // slug already decoded
  }
  const url = `${API_BASE}/api/series/${encodeURIComponent(decoded)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return res.json() as Promise<SeriesDetail>;
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

export async function getContributions(year?: string): Promise<ContributionsResponse> {
  const q = year ? `?year=${encodeURIComponent(year)}` : "";
  return fetchJson<ContributionsResponse>(`/api/contributions${q}`);
}

// GitHub 계정 하나의 가입 이후 전체 기여 합계 - 홈 숫자 카드용, 잔디(백엔드 합산)와 별개
export async function getGithubContributionAllTime(username: string): Promise<number> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=all`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub contributions for ${username} failed: ${res.status}`);
  const body = (await res.json()) as { total?: Record<string, number> };
  return Object.values(body.total ?? {}).reduce((sum, n) => sum + n, 0);
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
