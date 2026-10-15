import type { SkillItem } from "@/lib/api";
import { groupSkillsByKind } from "@/lib/about";
import { Chip } from "@/components/ui";

// Resume 역량 목록 - 키 순서대로 그림
const SKILL_GROUPS: { key: string; label: string }[] = [
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "infra", label: "DevOps" },
];

// 분야를 위에서 아래로 쌓고, 분야 안에서는 세부 묶음을 한 줄씩 (이름 | 칩)
export default function SkillGroups({ skills }: { skills: Record<string, SkillItem[]> }) {
  return (
    <div className="flex flex-col gap-8">
      {SKILL_GROUPS.filter((g) => skills[g.key]?.length).map((g) => (
        <div key={g.key} className="flex flex-col gap-3">
          <span className="text-sm font-semibold">{g.label}</span>
          {groupSkillsByKind(skills[g.key]).map((k) => (
            <div key={k.kind ?? "all"} className="grid grid-cols-1 sm:grid-cols-[110px_1fr] items-start gap-x-4 gap-y-1.5">
              {k.kind ? <span className="pt-1 text-xs text-muted">{k.kind}</span> : <span className="hidden sm:block" />}
              <div className="flex flex-wrap gap-2">
                {k.items.map((s) => (
                  <Chip key={s.name}>{s.name}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
