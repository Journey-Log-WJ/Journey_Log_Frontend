import Link from "next/link";
import type { RoadmapItem, RoadmapStatus } from "@/lib/api";

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  LEARNED: "지나온 길",
  SUCCEEDED: "지나온 길",
  FAILED: "지나온 길",
  IN_PROGRESS: "현재",
  PLANNED: "앞으로",
};

const STATUS_BADGE: Record<RoadmapStatus, string> = {
  LEARNED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  SUCCEEDED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  FAILED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  IN_PROGRESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  PLANNED: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

const CARD_ACCENT: Record<RoadmapStatus, string> = {
  LEARNED: "border-zinc-200 dark:border-zinc-800",
  SUCCEEDED: "border-zinc-200 dark:border-zinc-800",
  FAILED: "border-zinc-200 dark:border-zinc-800",
  IN_PROGRESS: "border-emerald-400 dark:border-emerald-600 shadow-sm",
  PLANNED: "border-dashed border-amber-300 dark:border-amber-800",
};

type Props = {
  items: RoadmapItem[];
};

export default function RoadmapPreview({ items }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-2">
      {items.map((item, i) => (
        <div key={item.slug} className="flex flex-col sm:flex-row sm:items-stretch sm:flex-1 gap-3 sm:gap-2">
          <Link
            href={`/roadmap/${item.slug}`}
            className={`flex-1 rounded-lg border p-4 flex flex-col gap-2 transition hover:border-zinc-400 dark:hover:border-zinc-600 ${CARD_ACCENT[item.status]}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-zinc-500">{item.period ?? ""}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[item.status]}`}>
                {STATUS_LABEL[item.status]}
              </span>
            </div>
            <div className="font-medium tracking-tight">{item.title}</div>
            {item.description && (
              <p className="text-xs text-zinc-500 line-clamp-2">{item.description}</p>
            )}
          </Link>
          {i < items.length - 1 && (
            <div className="flex items-center justify-center text-zinc-400 select-none">
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
