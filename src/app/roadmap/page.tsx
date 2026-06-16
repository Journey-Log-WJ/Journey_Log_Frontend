import { getRoadmaps, type RoadmapItem, type RoadmapStatus } from "@/lib/api";

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  PLANNING: "계획",
  DOING: "진행",
  DONE: "완료",
};

const STATUS_ORDER: RoadmapStatus[] = ["DOING", "PLANNING", "DONE"];

function formatTarget(date: string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
}

function groupByStatus(items: RoadmapItem[]): Record<RoadmapStatus, RoadmapItem[]> {
  const groups: Record<RoadmapStatus, RoadmapItem[]> = {
    PLANNING: [],
    DOING: [],
    DONE: [],
  };
  for (const item of items) {
    groups[item.status].push(item);
  }
  for (const status of STATUS_ORDER) {
    groups[status].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return groups;
}

export default async function RoadmapPage() {
  const items = await getRoadmaps();
  const groups = groupByStatus(items);

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">roadmap</h1>
        <p className="text-sm text-zinc-500">앞으로 만들 것 · 지금 만드는 것 · 만들었던 것</p>
      </header>

      {items.length === 0 ? (
        <p className="text-zinc-500">아직 로드맵 항목이 없습니다.</p>
      ) : (
        STATUS_ORDER.map((status) => {
          const group = groups[status];
          if (group.length === 0) return null;
          return (
            <section key={status} className="flex flex-col gap-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                {STATUS_LABEL[status]}
              </h2>
              <ul className="flex flex-col gap-6">
                {group.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                      {item.targetDate && (
                        <span className="text-xs text-zinc-500">{formatTarget(item.targetDate)}</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
