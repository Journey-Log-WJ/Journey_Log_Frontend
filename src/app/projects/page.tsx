import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import { GithubIcon } from "@/components/icons";
import { Chip, PageHeader } from "@/components/ui";

function BrowserFrame({ children, fixedAspect = true }: { children: React.ReactNode; fixedAspect?: boolean }) {
  return (
    <div className="w-full rounded-2xl border border-line bg-background overflow-hidden shadow-2xl shadow-black/20">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line">
        <span className="size-2.5 rounded-full bg-accent" />
        <span className="size-2.5 rounded-full bg-accent-2" />
        <span className="size-2.5 rounded-full bg-muted/50" />
      </div>
      <div className={fixedAspect ? "relative aspect-[16/10] flex items-center justify-center" : "relative"}>
        {children}
      </div>
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[240px] mx-auto">
      <div className="rounded-[2rem] border-[6px] border-surface-hover bg-background overflow-hidden shadow-2xl shadow-black/20">
        <div className="aspect-[9/16] relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.thumbnail) {
    if (project.device === "mobile") {
      return (
        <MobileFrame>
          <Image src={project.thumbnail} alt={project.title} fill unoptimized className="object-cover" />
        </MobileFrame>
      );
    }
    return (
      <BrowserFrame fixedAspect={false}>
        <Image
          src={project.thumbnail}
          alt={project.title}
          width={1002}
          height={558}
          unoptimized
          className="w-full h-auto block"
        />
      </BrowserFrame>
    );
  }
  if (project.logo) {
    return (
      <BrowserFrame>
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <Image
            src={project.logo}
            alt={project.title}
            width={800}
            height={800}
            unoptimized
            className="w-full h-full object-contain p-8"
          />
        </div>
      </BrowserFrame>
    );
  }
  const Frame = project.device === "mobile" ? MobileFrame : BrowserFrame;
  return (
    <Frame>
      <div className="flex flex-col items-center gap-2 text-muted">
        <span className="font-mono text-xs uppercase tracking-widest">preview</span>
        <span className="text-2xl font-semibold tracking-tight text-center px-4">{project.title}</span>
      </div>
    </Frame>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-16 py-6">
      <PageHeader
        eyebrow="Projects"
        title="만든 것들"
        description="배포된 것은 라이브로, 아직 로컬인 것은 목업으로 보여줘요."
      />

      <div className="flex flex-col gap-6">
        {PROJECTS.map((p) => (
          <article
            key={p.slug}
            className="rounded-3xl border border-line bg-surface p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <ProjectVisual project={p} />

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {p.pinned && (
                    <span className="rounded-full bg-accent-soft text-accent-2 px-2.5 py-0.5 font-semibold">대표</span>
                  )}
                  {p.status === "live" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 font-semibold text-foreground">
                      <span className="size-1.5 rounded-full bg-accent" />
                      LIVE
                    </span>
                  )}
                  <span className="font-mono">{p.period}</span>
                  <span>·</span>
                  <span>{p.role}</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{p.title}</h2>
                <p className="text-base text-muted">{p.subtitle}</p>
              </div>

              <ul className="flex flex-col gap-2 text-sm leading-relaxed">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="relative pl-4 before:absolute before:left-0 before:top-2 before:size-1 before:rounded-full before:bg-accent"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-strong text-foreground px-5 py-2.5 text-sm font-bold hover:opacity-85 transition-opacity"
                  >
                    라이브 보기
                    <ExternalLink className="size-4" />
                  </a>
                )}
                {p.repos.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover transition-colors"
                  >
                    <GithubIcon className="size-4" />
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
