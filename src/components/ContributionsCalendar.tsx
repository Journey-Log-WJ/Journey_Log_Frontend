import type { ContributionDay } from "@/lib/api";
import {
  HEATMAP_BG_CLASS,
  HEATMAP_FILL_CLASS,
  levelFor,
  quartileThresholds,
} from "@/lib/heatmap";

type Props = {
  days: ContributionDay[];
  totalCount: number;
};

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const HEADER_H = 20;
const MIN_LABEL_GAP = 3 * STEP;

export default function ContributionsCalendar({ days, totalCount }: Props) {
  if (days.length === 0) {
    return <p className="text-sm text-zinc-500">잔디 데이터를 불러올 수 없습니다.</p>;
  }

  const byDate = new Map(days.map((d) => [d.date, d]));
  const thresholds = quartileThresholds(days);

  const first = new Date(days[0].date);
  const last = new Date(days[days.length - 1].date);
  const start = new Date(first);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(last);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  const width = totalWeeks * STEP;
  const height = 7 * STEP + HEADER_H;

  const monthLabels: { x: number; label: string }[] = [];
  const monthDividers: number[] = [];
  let lastMonth = -1;
  let lastLabelX = -Infinity;
  for (let week = 0; week < totalWeeks; week++) {
    let dataDay: Date | null = null;
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date(start);
      d.setDate(d.getDate() + week * 7 + dow);
      if (d >= first && d <= last) {
        dataDay = d;
        break;
      }
    }
    if (!dataDay) continue;
    const month = dataDay.getMonth();
    if (month !== lastMonth) {
      const x = week * STEP;
      if (lastMonth !== -1) monthDividers.push(x - GAP / 2);
      if (x - lastLabelX >= MIN_LABEL_GAP) {
        monthLabels.push({ x, label: `${month + 1}월` });
        lastLabelX = x;
      }
      lastMonth = month;
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
      const level = levelFor(count, thresholds);
      cells.push(
        <rect
          key={key}
          x={week * STEP}
          y={HEADER_H + dow * STEP}
          width={CELL}
          height={CELL}
          rx={2}
          className={HEATMAP_FILL_CLASS[level]}
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
          <span className="font-medium text-zinc-950 dark:text-zinc-50">{totalCount}</span>건
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
          {monthDividers.map((x) => (
            <line
              key={`div-${x}`}
              x1={x}
              y1={HEADER_H - 4}
              x2={x}
              y2={height}
              strokeWidth={1}
              className="stroke-zinc-300 dark:stroke-zinc-700"
            />
          ))}
          {monthLabels.map((m) => (
            <text
              key={`m-${m.x}`}
              x={m.x + 2}
              y={12}
              fontSize={10}
              className="fill-zinc-500"
            >
              {m.label}
            </text>
          ))}
          {cells}
        </svg>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 self-end">
        <span>Less</span>
        {HEATMAP_BG_CLASS.map((cls, i) => (
          <span
            key={i}
            className={`inline-block rounded-sm ${cls}`}
            style={{ width: `${CELL}px`, height: `${CELL}px` }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
