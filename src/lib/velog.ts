// Velog GraphQL 직접 호출 (예전 Spring 백엔드의 VelogClient 와 같은 쿼리) - Next.js 서버에서만 실행, 1시간 캐시
const VELOG_API = "https://v2.velog.io/graphql";
export const VELOG_USERNAME = "dnjswns0010";
const REVALIDATE_SECONDS = 3600;
const PAGE_SIZE = 50;

export type VelogPost = {
  id: string;
  title: string;
  url_slug: string;
  released_at: string | null;
  updated_at: string | null;
  short_description: string | null;
  tags: string[] | null;
  thumbnail: string | null;
  body?: string | null;
};

export type VelogSeries = {
  id: string;
  name: string;
  url_slug: string;
  description: string | null;
  posts_count: number;
  updated_at: string | null;
};

export type VelogSeriesDetail = VelogSeries & {
  series_posts: { index: number; post: VelogPost }[];
};

async function velog<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(VELOG_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`Velog API failed: ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length || !json.data) {
    throw new Error(`Velog API error: ${json.errors?.map((e) => e.message).join(", ") ?? "no data"}`);
  }
  return json.data;
}

const POST_FIELDS = "id title url_slug released_at updated_at short_description tags thumbnail";

// 글 목록 - cursor(마지막 글 id)로 끝까지
export async function velogPosts(): Promise<VelogPost[]> {
  const all: VelogPost[] = [];
  let cursor: string | undefined;
  for (;;) {
    const { posts } = await velog<{ posts: VelogPost[] }>(
      `query Posts($username: String, $limit: Int, $cursor: ID) {
        posts(username: $username, limit: $limit, cursor: $cursor) { ${POST_FIELDS} }
      }`,
      { username: VELOG_USERNAME, limit: PAGE_SIZE, cursor },
    );
    all.push(...posts);
    if (posts.length < PAGE_SIZE) return all;
    cursor = posts[posts.length - 1].id;
  }
}

export async function velogPost(urlSlug: string): Promise<VelogPost | null> {
  const { post } = await velog<{ post: VelogPost | null }>(
    `query ReadPost($username: String, $url_slug: String) {
      post(username: $username, url_slug: $url_slug) { ${POST_FIELDS} body }
    }`,
    { username: VELOG_USERNAME, url_slug: urlSlug },
  );
  return post;
}

export async function velogSeriesList(): Promise<VelogSeries[]> {
  const { seriesList } = await velog<{ seriesList: VelogSeries[] }>(
    `query SeriesList($username: String) {
      seriesList(username: $username) { id name url_slug description posts_count updated_at }
    }`,
    { username: VELOG_USERNAME },
  );
  return seriesList;
}

export async function velogSeries(id: string): Promise<VelogSeriesDetail | null> {
  const { series } = await velog<{ series: VelogSeriesDetail | null }>(
    `query Series($id: ID) {
      series(id: $id) {
        id name url_slug description posts_count updated_at
        series_posts { index post { ${POST_FIELDS} } }
      }
    }`,
    { id },
  );
  return series;
}
