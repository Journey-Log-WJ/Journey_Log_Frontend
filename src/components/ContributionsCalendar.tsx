import type { ContributionDay } from "@/lib/api";

type Props = {
  days: ContributionDay[];
  totalCount: number;
};

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

const LEVEL_COLORS = [
  "#27272a",
  "#065f46",
  "#059669",
  "#10b981",
  "#34d399",
] as const;

function bucketize(days: ContributionDay[]): number[] {
  const nonZero = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  if (nonZero.length === 0) return [0, 0, 0, 0];
  const q = (p: number) => nonZero[Math.floor(nonZero.length * p)];
  return [q(0.25), q(0.5), q(0.75), nonZero[nonZero.length - 1]];
}

function levelOf(count: number, thresholds: number[]): number {
  if (count === 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4;
}

function toKey(date: string): string {
  return date;
}

export default function ContributionsCalendar({ days, totalCount }: Props) {
  if (days.length === 0) {
    return <p className="text-sm text-zinc-500">잔디 데이터를 불러올 수 없습니다.</p>;
  }

  const byDate = new Map(days.map((d) => [toKey(d.date), d]));
  const thresholds = bucketize(days);

  const first = new Date(days[0].date);
  const last = new Date(days[days.length - 1].date);
  const start = new Date(first);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(last);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  const width = totalWeeks * STEP;
  const height = 7 * STEP + 20;

  const monthLabels: { x: number; label: string }[] = [];
  let lastMonth = -1;
  for (let week = 0; week < totalWeeks; week++) {
    const d = new Date(start);
    d.setDate(d.getDate() + week * 7);
    if (d.getMonth() !== lastMonth) {
      monthLabels.push({ x: week * STEP, label: `${d.getMonth() + 1}월` });
      lastMonth = d.getMonth();
    }
  }

  const cells: React.ReactElement[] = [];
  for (let week = 0; week < totalWeeks; week++) {
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date(start);
      d.setDate(d.getDate() + week * 7 + dow);
      if (d < first || d > last) continue;
      const key = d.toISOString().slice(0, 10);
      const day = byDate.get(key);
      const count = day?.count ?? 0;
      const level = levelOf(count, thresholds);
      cells.push(
        <rect
          key={key}
          x={week * STEP}
          y={20 + dow * STEP}
          width={CELL}
          height={CELL}
          rx={2}
          fill={LEVEL_COLORS[level]}
        >
          <title>{`${key} — ${count}건`}</title>
        </rect>,
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          지난 1년 <span className="font-medium text-zinc-950 dark:text-zinc-50">{totalCount}</span>건
        </span>
        <span className="text-xs text-zinc-500">(개인 + 회사 계정 합산)</span>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ minWidth: `${width}px` }}
          role="img"
          aria-label="GitHub contributions calendar"
        >
          {monthLabels.map((m) => (
            <text
              key={`m-${m.x}`}
              x={m.x}
              y={12}
              fontSize={10}
              fill="currentColor"
              className="text-zinc-500"
            >
              {m.label}
            </text>
          ))}
          {cells}
        </svg>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 self-end">
        <span>Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <span
            key={i}
            className="inline-block rounded-sm"
            style={{ width: `${CELL}px`, height: `${CELL}px`, background: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
