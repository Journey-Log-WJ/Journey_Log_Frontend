import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import { GithubIcon } from "@/components/icons";

function LaptopFrame({ children, fixedAspect = true }: { children: React.ReactNode; fixedAspect?: boolean }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-t-xl border border-[#8B5A2B]/25 bg-[#f5ede0] dark:bg-[#3d2f22] overflow-hidden shadow-md">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#8B5A2B]/15">
          <span className="size-2.5 rounded-full bg-[#e07b39]" />
          <span className="size-2.5 rounded-full bg-[#D4A574]" />
          <span className="size-2.5 rounded-full bg-[#7ea862]" />
        </div>
        <div
          className={
            fixedAspect
              ? "aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-[#f5ede0] to-[#d4a574]/30 dark:from-[#3d2f22] dark:to-[#2a2016]"
              : "bg-white"
          }
        >
          {children}
        </div>
      </div>
      <div className="mx-auto h-1.5 w-1/2 rounded-b-md bg-[#8B5A2B]/25" />
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[240px] mx-auto">
      <div className="rounded-[2rem] border-[6px] border-[#2a2016] dark:border-[#3d2f22] bg-[#f5ede0] dark:bg-[#2a2016] overflow-hidden shadow-lg">
        <div className="aspect-[9/16] relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function Placeholder({ title, logo }: { title: string; logo?: string }) {
  if (logo) {
    return (
      <Image
        src={logo}
        alt={title}
        width={200}
        height={200}
        unoptimized
        className="w-1/2 max-w-[180px] h-auto"
      />
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 text-[#8B5A2B]/70 dark:text-[#D4A574]/70">
      <span className="font-mono text-xs uppercase tracking-widest">preview</span>
      <span className="text-2xl font-semibold tracking-tight text-center px-4">{title}</span>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.thumbnail) {
    if (project.device === "mobile") {
      return (
        <MobileFrame>
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            unoptimized
            className="object-cover"
          />
        </MobileFrame>
      );
    }
    return (
      <LaptopFrame fixedAspect={false}>
        <Image
          src={project.thumbnail}
          alt={project.title}
          width={501}
          height={279}
          unoptimized
          className="w-full h-auto block"
        />
      </LaptopFrame>
    );
  }
  if (project.logo) {
    return (
      <LaptopFrame>
        <div className="w-full h-full bg-white flex items-center justify-center">
          <Image
            src={project.logo}
            alt={project.title}
            width={800}
            height={800}
            unoptimized
            className="w-full h-full object-contain p-4"
          />
        </div>
      </LaptopFrame>
    );
  }
  const Frame = project.device === "mobile" ? MobileFrame : LaptopFrame;
  return (
    <Frame>
      <Placeholder title={project.title} />
    </Frame>
  );
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#8B5A2B] dark:text-[#D4A574]">
          Projects
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-400">
          만든 것들. 배포된 것은 라이브로, 아직 로컬인 것은 목업으로.
        </p>
      </section>

      <div className="flex flex-col gap-20">
        {PROJECTS.map((p) => (
          <article
            key={p.slug}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
          >
            <ProjectVisual project={p} />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
                  {p.pinned && (
                    <>
                      <span className="inline-flex items-center gap-1 text-[#8B5A2B] dark:text-[#D4A574] font-semibold">
                        📌 고정됨
                      </span>
                      <span>·</span>
                    </>
                  )}
                  <span>{p.period}</span>
                  <span>·</span>
                  <span>{p.role}</span>
                  {p.status === "live" && (
                    <>
                      <span>·</span>
                      <span className="text-[#7ea862] font-semibold">LIVE</span>
                    </>
                  )}
                </div>
                <h2 className="text-3xl font-semibold tracking-tight">{p.title}</h2>
                <p className="text-base text-stone-600 dark:text-stone-400">{p.subtitle}</p>
              </div>

              <ul className="flex flex-col gap-1.5 text-sm text-stone-700 dark:text-stone-300">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="pl-4 relative before:content-['·'] before:absolute before:left-1 before:text-[#8B5A2B] dark:before:text-[#D4A574]"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 pt-1">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#8B5A2B]/10 text-[#8B5A2B] dark:bg-[#D4A574]/10 dark:text-[#D4A574]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5A2B] text-[#f5ede0] hover:bg-[#B08D57] text-sm font-semibold"
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
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#8B5A2B]/30 text-[#8B5A2B] dark:text-[#D4A574] hover:bg-[#8B5A2B]/5 text-sm font-semibold"
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
