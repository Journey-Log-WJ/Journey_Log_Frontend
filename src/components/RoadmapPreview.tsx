import Link from "next/link";
import type { RoadmapItem, RoadmapStatus } from "@/lib/api";

const PIN_COLOR: Record<RoadmapStatus, string> = {
  LEARNED: "#B08D57",
  SUCCEEDED: "#B08D57",
  FAILED: "#B08D57",
  IN_PROGRESS: "#8B5A2B",
  PLANNED: "#f59e0b",
};

const VB_W = 900;
const ROAD_H = 220;
const ROAD_CENTER = ROAD_H / 2;
const ROAD_AMPL = 40;

const STONES = [
  { x: 90, y: 55, rx: 5, ry: 3 },
  { x: 220, y: 62, rx: 6, ry: 4 },
  { x: 360, y: 50, rx: 4, ry: 3 },
  { x: 480, y: 58, rx: 5, ry: 3 },
  { x: 730, y: 62, rx: 5, ry: 3 },
  { x: 830, y: 55, rx: 6, ry: 4 },
  { x: 60, y: 205, rx: 5, ry: 3 },
  { x: 190, y: 210, rx: 6, ry: 4 },
  { x: 320, y: 208, rx: 4, ry: 3 },
  { x: 460, y: 212, rx: 7, ry: 4 },
  { x: 570, y: 205, rx: 5, ry: 3 },
  { x: 780, y: 208, rx: 4, ry: 3 },
  { x: 870, y: 210, rx: 5, ry: 3 },
];

const DIRT = [
  { x: 130, y: 62, w: 26, h: 6 },
  { x: 400, y: 58, w: 32, h: 7 },
  { x: 550, y: 68, w: 22, h: 5 },
  { x: 750, y: 55, w: 28, h: 6 },
  { x: 260, y: 202, w: 30, h: 7 },
  { x: 500, y: 210, w: 26, h: 6 },
  { x: 720, y: 200, w: 32, h: 7 },
  { x: 850, y: 205, w: 22, h: 5 },
];

const TREES = [
  { x: 60, y: 36, s: 1.1, c: "#4a7c59" },
  { x: 180, y: 30, s: 1.2, c: "#3d6b52" },
  { x: 290, y: 40, s: 1.0, c: "#5f8a6c" },
  { x: 585, y: 34, s: 1.1, c: "#4a7c59" },
  { x: 685, y: 42, s: 1.0, c: "#5f8a6c" },
  { x: 790, y: 34, s: 1.1, c: "#3d6b52" },
  { x: 870, y: 40, s: 1.0, c: "#5f8a6c" },
  { x: 80, y: 200, s: 1.15, c: "#3d6b52" },
  { x: 320, y: 202, s: 1.05, c: "#5f8a6c" },
  { x: 460, y: 198, s: 1.1, c: "#4a7c59" },
  { x: 810, y: 202, s: 1.05, c: "#3d6b52" },
  { x: 875, y: 208, s: 1.0, c: "#4a7c59" },
];

function sampleRoad(t: number, freq: number): { x: number; y: number } {
  const x = t * VB_W;
  const y = ROAD_CENTER + ROAD_AMPL * Math.sin(t * Math.PI * 2 * freq);
  return { x, y };
}

function Tree({ x, y, s, c }: { x: number; y: number; s: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2} y={0} width={4} height={8} fill="#3d2f22" />
      <polygon points="0,-24 -11,-4 11,-4" fill={c} />
      <polygon points="0,-16 -8,2 8,2" fill={c} opacity={0.85} />
    </g>
  );
}

function Rock({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="#8a8a8a" />
      <ellipse cx={-rx * 0.2} cy={-ry * 0.3} rx={rx * 0.6} ry={ry * 0.4} fill="#b8b8b8" opacity={0.7} />
    </g>
  );
}

function DirtPatch({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} fill="#a67c52" opacity={0.85} />
      <ellipse cx={-w * 0.15} cy={-h * 0.2} rx={w * 0.28} ry={h * 0.4} fill="#8b6539" opacity={0.6} />
      <circle cx={w * 0.2} cy={0} r={h * 0.4} fill="#7a5a35" opacity={0.5} />
    </g>
  );
}

function Deer({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={-4} rx={8} ry={4} fill="#a0522d" />
      <line x1={-6} y1={-2} x2={-6} y2={4} stroke="#3d2f22" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={-3} y1={-2} x2={-3} y2={4} stroke="#3d2f22" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={4} y1={-2} x2={4} y2={4} stroke="#3d2f22" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={7} y1={-2} x2={7} y2={4} stroke="#3d2f22" strokeWidth={1.4} strokeLinecap="round" />
      <path d="M6,-6 L9,-9 L9,-4" fill="#a0522d" />
      <ellipse cx={9} cy={-9} rx={2.2} ry={1.8} fill="#a0522d" />
      <path d="M8,-11 L7,-14 M10,-11 L11,-14 M7.5,-13 L6,-15 M10.5,-13 L12,-15" stroke="#3d2f22" strokeWidth={0.9} fill="none" strokeLinecap="round" />
      <circle cx={10} cy={-9.5} r={0.3} fill="#27272a" />
      <path d="M-8,-5 L-11,-8" stroke="#a0522d" strokeWidth={1.8} strokeLinecap="round" />
    </g>
  );
}

function Rabbit({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={4.5} ry={3} fill="#c4a884" />
      <circle cx={3.5} cy={-2} r={2.4} fill="#c4a884" />
      <path d="M2.5,-4 Q2,-8 3,-8" stroke="#c4a884" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M4.5,-4 Q5,-8 4,-8" stroke="#c4a884" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <circle cx={4.2} cy={-2} r={0.4} fill="#27272a" />
      <circle cx={-4.5} cy={1.5} r={1.4} fill="#f5f5f5" />
    </g>
  );
}

function Fox({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={-2} rx={6} ry={2.8} fill="#e07b39" />
      <path d="M-6,-2 L-11,-4 L-9,0 Z" fill="#e07b39" />
      <circle cx={-11} cy={-3.5} r={1} fill="#ffffff" />
      <circle cx={6} cy={-3.5} r={2.2} fill="#e07b39" />
      <polygon points="4.5,-5 5,-7 6,-5.5" fill="#e07b39" />
      <polygon points="7,-5 6.5,-7 7.5,-5.5" fill="#e07b39" />
      <polygon points="4.7,-5.2 5.1,-6.3 5.7,-5.4" fill="#7a3d15" />
      <polygon points="6.9,-5.2 6.6,-6.3 7.3,-5.4" fill="#7a3d15" />
      <circle cx={5.5} cy={-3.5} r={0.35} fill="#27272a" />
      <line x1={-4} y1={0.5} x2={-4} y2={3.5} stroke="#3d2f22" strokeWidth={1.1} strokeLinecap="round" />
      <line x1={4} y1={0.5} x2={4} y2={3.5} stroke="#3d2f22" strokeWidth={1.1} strokeLinecap="round" />
    </g>
  );
}

function Worker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-5,-6 Q0,-11 5,-6 L5,-4 L-5,-4 Z" fill="#f59e0b" />
      <rect x={-5.5} y={-4.5} width={11} height={1.2} fill="#3d2f22" />
      <circle cx={0} cy={-1} r={3.2} fill="#f5deb3" />
      <rect x={-4} y={2} width={8} height={9} fill="#f59e0b" />
      <rect x={-4} y={5} width={8} height={1.5} fill="#fafafa" />
      <line x1={-4} y1={4} x2={-7} y2={10} stroke="#3d2f22" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={4} y1={4} x2={7} y2={10} stroke="#3d2f22" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={-2} y1={11} x2={-3} y2={17} stroke="#3d2f22" strokeWidth={1.6} strokeLinecap="round" />
      <line x1={2} y1={11} x2={3} y2={17} stroke="#3d2f22" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function Excavator({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-18} y={-3} width={36} height={7} rx={3.5} fill="#27272a" />
      <circle cx={-13} cy={0.5} r={3} fill="#3d3d3d" />
      <circle cx={-2} cy={0.5} r={3} fill="#3d3d3d" />
      <circle cx={13} cy={0.5} r={3} fill="#3d3d3d" />
      <rect x={-14} y={-15} width={26} height={12} rx={2} fill="#f59e0b" stroke="#27272a" strokeWidth={0.6} />
      <rect x={-4} y={-24} width={12} height={11} rx={2} fill="#f59e0b" stroke="#27272a" strokeWidth={0.6} />
      <rect x={-2} y={-22} width={8} height={6} fill="#87ceeb" />
      <line x1={11} y1={-17} x2={26} y2={-27} stroke="#f59e0b" strokeWidth={4.5} strokeLinecap="round" />
      <line x1={11} y1={-17} x2={26} y2={-27} stroke="#27272a" strokeWidth={0.6} />
      <line x1={26} y1={-27} x2={36} y2={-15} stroke="#f59e0b" strokeWidth={4} strokeLinecap="round" />
      <line x1={26} y1={-27} x2={36} y2={-15} stroke="#27272a" strokeWidth={0.5} />
      <path d="M33,-17 L40,-9 L36,-4 L29,-11 Z" fill="#f59e0b" stroke="#27272a" strokeWidth={0.6} />
    </g>
  );
}

function DumpTruck({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-20} y={-14} width={22} height={11} fill="#f59e0b" stroke="#27272a" strokeWidth={0.6} />
      <rect x={-20} y={-14} width={22} height={2} fill="#c17a0d" />
      <rect x={2} y={-13} width={11} height={10} fill="#f59e0b" stroke="#27272a" strokeWidth={0.6} />
      <rect x={4} y={-11} width={6} height={5} fill="#87ceeb" />
      <rect x={-22} y={-3} width={36} height={3} fill="#27272a" />
      <circle cx={-13} cy={2} r={3.2} fill="#27272a" />
      <circle cx={9} cy={2} r={3.2} fill="#27272a" />
      <circle cx={-13} cy={2} r={1.2} fill="#5f5f5f" />
      <circle cx={9} cy={2} r={1.2} fill="#5f5f5f" />
    </g>
  );
}

function Cone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={5} ry={1.2} fill="#27272a" />
      <polygon points="0,-11 -4.5,0 4.5,0" fill="#f97316" />
      <rect x={-3.2} y={-6.5} width={6.4} height={1.4} fill="#fafafa" />
      <rect x={-4} y={-3} width={8} height={1.4} fill="#fafafa" />
    </g>
  );
}

type Props = {
  items: RoadmapItem[];
};

export default function RoadmapPreview({ items }: Props) {
  const N = items.length;
  if (N === 0) return null;

  const freq = N / 2;
  const SAMPLES = N * 40;
  const firstPlannedIdx = items.findIndex((it) => it.status === "PLANNED");
  const constructionStart =
    firstPlannedIdx === -1
      ? SAMPLES + 1
      : Math.round(((firstPlannedIdx + 0.5) / N) * SAMPLES);

  const allPoints = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const { x, y } = sampleRoad(i / SAMPLES, freq);
    return { x, y };
  });
  const asStr = (pt: { x: number; y: number }) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  const builtPoints = allPoints.slice(0, constructionStart + 1).map(asStr).join(" ");
  const constructionPoints = allPoints.slice(constructionStart).map(asStr).join(" ");
  const conePos = allPoints[Math.min(constructionStart, SAMPLES)];

  const pins = items.map((item, idx) => {
    const t = (idx + 0.5) / N;
    const { x, y } = sampleRoad(t, freq);
    return { item, x, y, idx };
  });

  const inProgressIdx = items.findIndex((it) => it.status === "IN_PROGRESS");
  const carIdx = inProgressIdx !== -1 ? inProgressIdx : 0;
  const carT = Math.min(
    (carIdx + 0.85) / N,
    (firstPlannedIdx === -1 ? 1 : (firstPlannedIdx + 0.5) / N) - 0.03
  );
  const carSampleIdx = Math.round(carT * SAMPLES);
  const carP0 = allPoints[Math.max(0, carSampleIdx - 1)];
  const carP1 = allPoints[Math.min(SAMPLES, carSampleIdx + 1)];
  const carAngle = (Math.atan2(carP1.y - carP0.y, carP1.x - carP0.x) * 180) / Math.PI;
  const carPos = allPoints[carSampleIdx];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${VB_W} ${ROAD_H}`}
          preserveAspectRatio="none"
          className="w-full h-56 sm:h-72 rounded-lg"
          aria-hidden
        >
          {/* 풀숲 배경 */}
          <rect x={0} y={0} width={VB_W} height={ROAD_H} fill="#a8c988" />
          {/* 잔디 결 */}
          <g stroke="#7ab058" strokeWidth={1} opacity={0.65}>
            {Array.from({ length: 90 }, (_, i) => {
              const gx = (i * 11 + (i % 4) * 3) % VB_W;
              const gy = (i * 7 + (i % 5) * 13) % ROAD_H;
              return <line key={i} x1={gx} y1={gy} x2={gx + 2} y2={gy + 4} />;
            })}
          </g>
          {/* 흙 패치 */}
          {DIRT.map((d, i) => (
            <DirtPatch key={i} {...d} />
          ))}
          {/* 돌 */}
          {STONES.map((s, i) => (
            <Rock key={i} {...s} />
          ))}
          {/* 야생동물 */}
          <Deer x={250} y={55} />
          <Rabbit x={220} y={205} />
          <Fox x={505} y={200} />
          {/* 숲 */}
          {TREES.map((t, i) => (
            <Tree key={i} {...t} />
          ))}

          {/* 완성된 도로 */}
          <polyline
            points={builtPoints}
            fill="none"
            stroke="#27272a"
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={builtPoints}
            fill="none"
            stroke="#fafafa"
            strokeWidth={2}
            strokeDasharray="10 8"
            strokeLinecap="round"
          />

          {/* 공사 중 도로 (황토색 흙길) */}
          {firstPlannedIdx !== -1 && (
            <>
              <polyline
                points={constructionPoints}
                fill="none"
                stroke="#c19a5b"
                strokeWidth={30}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={constructionPoints}
                fill="none"
                stroke="#8b7355"
                strokeWidth={1.5}
                strokeDasharray="5 7"
                strokeLinecap="round"
                opacity={0.6}
              />
            </>
          )}

          {/* 아반떼 CN7 실루엣 (현재 위치) */}
          <g transform={`translate(${carPos.x} ${carPos.y}) rotate(${carAngle})`}>
            <path
              d="M -25,3 L -25,-2 Q -25,-4 -22,-5 L -18,-7 L -13,-12 L -4,-14 L 6,-14 L 13,-12 L 19,-7 L 24,-5 Q 25,-4 25,-2 L 25,3 Z"
              fill="#ffffff"
              stroke="#27272a"
              strokeWidth={1.3}
              strokeLinejoin="round"
            />
            <path
              d="M -12,-11 L -3,-13 L 5,-13 L 11,-11 L 9,-8 L -10,-8 Z"
              fill="#2a3a4a"
              opacity={0.85}
            />
            <line x1={-2} y1={-13} x2={-2} y2={-8} stroke="#ffffff" strokeWidth={0.8} opacity={0.7} />
            <line x1={-22} y1={-1} x2={22} y2={-1} stroke="#27272a" strokeWidth={0.5} opacity={0.4} />
            <rect x={22} y={-4.5} width={3} height={2.2} rx={0.6} fill="#f5deb3" />
            <rect x={-25} y={-4.5} width={3} height={2.2} rx={0.6} fill="#c93030" opacity={0.85} />
            <circle cx={-16} cy={4} r={4.2} fill="#27272a" />
            <circle cx={16} cy={4} r={4.2} fill="#27272a" />
            <circle cx={-16} cy={4} r={2.2} fill="#5f5f5f" />
            <circle cx={16} cy={4} r={2.2} fill="#5f5f5f" />
            <circle cx={-16} cy={4} r={0.6} fill="#27272a" />
            <circle cx={16} cy={4} r={0.6} fill="#27272a" />
          </g>

          {/* 공사 크루 */}
          {conePos && firstPlannedIdx !== -1 && (
            <>
              <Cone x={conePos.x - 8} y={conePos.y + 22} s={1.1} />
              <Cone x={conePos.x + 4} y={conePos.y + 24} s={0.9} />
              <Worker x={conePos.x + 22} y={conePos.y - 20} />
              <Excavator x={conePos.x + 70} y={conePos.y - 8} />
              <DumpTruck x={conePos.x + 145} y={conePos.y - 5} />
            </>
          )}

          {/* 핀 */}
          {pins.map(({ item, x, y, idx }) => (
            <g key={item.slug}>
              <circle
                cx={x}
                cy={y}
                r={14}
                fill={PIN_COLOR[item.status]}
                stroke="#f5ede0"
                strokeWidth={3}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="#f5ede0"
              >
                {String(idx + 1).padStart(2, "0")}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* 각 핀 아래 라벨 카드 */}
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/roadmap/${item.slug}`}
            className="flex flex-col gap-1.5 text-center hover:text-[#8B5A2B] dark:hover:text-[#D4A574]"
          >
            <span className="text-sm font-mono text-stone-500">{item.period ?? ""}</span>
            <span className="text-lg font-semibold tracking-tight">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
