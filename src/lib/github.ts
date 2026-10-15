// GitHub 기여(잔디) - 공식 GraphQL API(GITHUB_TOKEN 필요)로 가져오고, 토큰이 없거나 실패하면 jogruber 공개 API 로 대체
// Next.js 서버에서만 실행, 1시간 캐시. 토큰은 서버 환경변수라 방문자에게 노출되지 않음
const REVALIDATE_SECONDS = 3600;

export type DayCount = { date: string; count: number };

type CalendarResponse = {
  user: {
    contributionsCollection: {
      contributionYears: number[];
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
      };
    };
  } | null;
};

async function githubGraphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`GitHub GraphQL failed: ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length || !json.data) {
    throw new Error(`GitHub GraphQL error: ${json.errors?.map((e) => e.message).join(", ") ?? "no data"}`);
  }
  return json.data;
}

const CALENDAR_QUERY = `query Calendar($login: String!, $from: DateTime, $to: DateTime) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionYears
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

// year 없으면 최근 1년, 있으면 그 해 1/1 ~ 12/31
function range(year?: string): { from?: string; to?: string } {
  if (!year || !/^\d{4}$/.test(year)) return {};
  return { from: `${year}-01-01T00:00:00Z`, to: `${year}-12-31T23:59:59Z` };
}

async function calendarFromGithub(login: string, year?: string) {
  const data = await githubGraphql<CalendarResponse>(CALENDAR_QUERY, { login, ...range(year) });
  if (!data.user) throw new Error(`GitHub user not found: ${login}`);
  return data.user.contributionsCollection;
}

async function daysFromJogruber(login: string, year?: string): Promise<DayCount[]> {
  const y = year && /^\d{4}$/.test(year) ? year : "last";
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(login)}?y=${y}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`jogruber failed: ${res.status}`);
  const body = (await res.json()) as { contributions?: DayCount[] };
  return body.contributions ?? [];
}

// 계정 하나의 날짜별 기여
export async function contributionDays(login: string, year?: string): Promise<DayCount[]> {
  try {
    const c = await calendarFromGithub(login, year);
    return c.contributionCalendar.weeks.flatMap((w) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
    );
  } catch {
    return daysFromJogruber(login, year);
  }
}

// 계정 하나의 가입 이후 전체 기여 합계
export async function contributionAllTime(login: string): Promise<number> {
  try {
    const { contributionYears } = await calendarFromGithub(login);
    const totals = await Promise.all(
      contributionYears.map(async (y) => (await calendarFromGithub(login, String(y))).contributionCalendar.totalContributions),
    );
    return totals.reduce((sum, n) => sum + n, 0);
  } catch {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(login)}?y=all`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`jogruber failed: ${res.status}`);
    const body = (await res.json()) as { total?: Record<string, number> };
    return Object.values(body.total ?? {}).reduce((sum, n) => sum + n, 0);
  }
}
