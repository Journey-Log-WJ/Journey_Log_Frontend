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

// 색은 globals.css의 heat-0~4 토큰
export const HEATMAP_FILL_CLASS: readonly string[] = [
  "fill-heat-0",
  "fill-heat-1",
  "fill-heat-2",
  "fill-heat-3",
  "fill-heat-4",
];

export const HEATMAP_BG_CLASS: readonly string[] = [
  "bg-heat-0",
  "bg-heat-1",
  "bg-heat-2",
  "bg-heat-3",
  "bg-heat-4",
];
