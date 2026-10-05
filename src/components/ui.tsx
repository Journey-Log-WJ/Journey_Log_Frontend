import Link from "next/link";
import { ArrowRight } from "lucide-react";

// 페이지 공용 UI 조각 — 색은 globals.css 토큰만 사용

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-md border border-line bg-surface text-muted">
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-2">{children}</span>
  );
}

export function SectionHeader({ eyebrow, title, href, linkLabel }: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm text-muted hover:text-foreground shrink-0"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// 각 페이지 맨 위 제목 블록
export function PageHeader({ eyebrow, title, description }: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="animate-fade-up flex flex-col gap-4 pt-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-base sm:text-lg text-muted max-w-2xl">{description}</p>}
    </section>
  );
}
