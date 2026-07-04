export type Countable = { count: number };

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export function quartileThresholds(items: Countable[]): [number, number, number, number] {
  const nonZero = items.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  if (nonZero.length === 0) return [0, 0, 0, 0];
  const q = (p: number) => nonZero[Math.floor(nonZero.length * p)];
  return [q(0.25), q(0.5), q(0.75), nonZero[nonZero.length - 1]];
}

export function levelFor(count: number, thresholds: readonly number[]): HeatmapLevel {
  if (count <= 0) return 0;
  if (count <= thresholds[0]) return 1;
  if (count <= thresholds[1]) return 2;
  if (count <= thresholds[2]) return 3;
  return 4;
}

export const HEATMAP_FILL_CLASS: readonly string[] = [
  "fill-zinc-200 dark:fill-zinc-800",
  "fill-emerald-200 dark:fill-emerald-900",
  "fill-emerald-400 dark:fill-emerald-700",
  "fill-emerald-500",
  "fill-emerald-600 dark:fill-emerald-300",
];

export const HEATMAP_BG_CLASS: readonly string[] = [
  "bg-zinc-200 dark:bg-zinc-800",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-600 dark:bg-emerald-300",
];
