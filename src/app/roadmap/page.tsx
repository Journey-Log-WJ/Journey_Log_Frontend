import Link from "next/link";
import { getRoadmaps, type RoadmapItem, type RoadmapStatus } from "@/lib/api";

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  PLANNED: "계획",
  IN_PROGRESS: "진행",
  SUCCEEDED: "성공",
  FAILED: "실패",
  LEARNED: "경험",
};

const STATUS_COLOR: Record<RoadmapStatus, { pin: string; badge: string }> = {
  PLANNED: {
    pin: "#a1a1aa",
    badge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
  IN_PROGRESS: {
    pin: "#0ea5e9",
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  SUCCEEDED: {
    pin: "#10b981",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  FAILED: {
    pin: "#f43f5e",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  LEARNED: {
    pin: "#f59e0b",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

const ROW_HEIGHT = 120;
const ROAD_WIDTH = 80;
const VB_W = ROAD_WIDTH;
const ROAD_CENTER = ROAD_WIDTH / 2;
const ROAD_AMPL = 16;

function sortedItems(items: RoadmapItem[]): RoadmapItem[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

function sampleRoad(t: number, totalH: number, freq: number): { x: number; y: number } {
  const y = t * totalH;
  const x = ROAD_CENTER + ROAD_AMPL * Math.sin(t * Math.PI * 2 * freq);
  return { x, y };
}

export default async function RoadmapPage() {
  const items = sortedItems(await getRoadmaps());
  const N = items.length;
  const totalH = ROW_HEIGHT * N;
  const freq = Math.max(1, N / 4);

  const pathPoints = Array.from({ length: N * 20 + 1 }, (_, i) => {
    const { x, y } = sampleRoad(i / (N * 20), totalH, freq);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const pins = items.map((item, idx) => {
    const t = (idx + 0.5) / N;
    const { x, y } = sampleRoad(t, totalH, freq);
    return { item, x, y, idx };
  });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">roadmap</h1>
        <p className="text-sm text-zinc-500">부천대부터 지금까지 — 실패했지만 넘어간 것, 성공했지만 남은 생각</p>
      </header>

      {N === 0 ? (
        <p className="text-zinc-500">아직 항목이 없습니다.</p>
      ) : (
        <div className="relative" style={{ height: `${totalH}px` }}>
          {/* 도로 (왼쪽 컬럼 절대 배치) */}
          <svg
            viewBox={`0 0 ${VB_W} ${totalH}`}
            preserveAspectRatio="none"
            className="absolute left-0 top-0"
            style={{ width: `${ROAD_WIDTH}px`, height: `${totalH}px` }}
            aria-hidden
          >
            <polyline
              points={pathPoints}
              fill="none"
              stroke="#27272a"
              strokeWidth={28}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={pathPoints}
              fill="none"
              stroke="#fafafa"
              strokeWidth={2}
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
            {pins.map(({ item, x, y, idx }) => {
              const color = STATUS_COLOR[item.status].pin;
              return (
                <g key={item.id}>
                  <circle cx={x} cy={y} r={12} fill={color} stroke="white" strokeWidth={2.5} />
                  <text
                    x={x}
                    y={y + 4}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="white"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* 카드 (오른쪽 컬럼) */}
          <ol className="absolute top-0 left-0 right-0">
            {items.map((item, idx) => {
              const color = STATUS_COLOR[item.status];
              const top = idx * ROW_HEIGHT;
              return (
                <li
                  key={item.id}
                  className="absolute left-0 right-0"
                  style={{ top: `${top}px`, height: `${ROW_HEIGHT}px`, paddingLeft: `${ROAD_WIDTH + 24}px` }}
                >
                  <Link
                    href={`/roadmap/${item.slug}`}
                    className="group flex flex-col gap-1.5 h-full justify-center"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {item.period && (
                        <span className="text-xs text-zinc-500 tabular-nums">{item.period}</span>
                      )}
                      <h3 className="font-medium tracking-tight group-hover:underline">
                        {item.title}
                      </h3>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${color.badge}`}>
                        {STATUS_LABEL[item.status]}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
