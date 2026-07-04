import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAbout } from "@/lib/api";

const LEVEL_COLOR: Record<string, string> = {
  상: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  중: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  하: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const CATEGORY_LABEL: Record<string, string> = {
  language: "Language",
  framework: "Framework / Library",
  database: "Database",
  infra: "Infra / Tool",
};

export default async function AboutPage() {
  const about = await getAbout();
  if (!about) {
    return <p className="text-zinc-500">아직 이력서가 등록되지 않았습니다.</p>;
  }

  const { profile, careers, educations, trainings, certifications, skills, portfolios, military, coverLetter } = about;
  const sortedCareers = [...careers].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedEducations = [...educations].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedTrainings = [...trainings].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="flex flex-col gap-14">
      {/* 상단 헤더 */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            경력
          </span>
        </div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{profile.tagline}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <span>{profile.email}</span>
          <span>·</span>
          <span>{profile.region}</span>
        </div>
      </header>

      {/* 정보 박스 4개 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <InfoBox label="경력" value={profile.careerPeriod} sub={profile.isEmployed ? "재직중" : undefined} />
        <InfoBox label="학력" value="대학교(4년) 졸업" sub="국평원 정보통신학과" />
        {profile.desiredSalary && <InfoBox label="희망연봉" value={profile.desiredSalary} />}
        <InfoBox label="포트폴리오" value={`총 ${portfolios.length}건`} />
      </section>

      {/* 링크 */}
      <section className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {profile.contacts.githubPersonal && (
          <a href={profile.contacts.githubPersonal} target="_blank" rel="noreferrer" className="hover:underline text-zinc-700 dark:text-zinc-300">
            GitHub (개인)
          </a>
        )}
        {profile.contacts.githubWork && (
          <a href={profile.contacts.githubWork} target="_blank" rel="noreferrer" className="hover:underline text-zinc-700 dark:text-zinc-300">
            GitHub (회사)
          </a>
        )}
        {profile.contacts.velog && (
          <a href={profile.contacts.velog} target="_blank" rel="noreferrer" className="hover:underline text-zinc-700 dark:text-zinc-300">
            Velog
          </a>
        )}
        {profile.contacts.blog && (
          <a href={profile.contacts.blog} target="_blank" rel="noreferrer" className="hover:underline text-zinc-700 dark:text-zinc-300">
            Blog
          </a>
        )}
      </section>

      {/* 간략 소개 */}
      <Section title="간략 소개">
        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {profile.intro}
        </p>
      </Section>

      {/* 스킬 */}
      <Section title="나의 스킬">
        <div className="flex flex-col gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {CATEGORY_LABEL[category] ?? category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span
                    key={skill.name}
                    className={`text-xs px-2 py-1 rounded flex items-center gap-1.5 ${
                      skill.level ? LEVEL_COLOR[skill.level] : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="text-[10px] font-medium opacity-70">{skill.level}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 경력 */}
      <Section title="경력" sub={profile.careerPeriod}>
        <ol className="flex flex-col gap-8">
          {sortedCareers.map((c, idx) => (
            <li key={idx} className="flex flex-col gap-3 border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-zinc-500">{c.period}</div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="font-medium">{c.company}</h3>
                  {c.position && <span className="text-sm text-zinc-500">{c.position}</span>}
                  {c.role && <span className="text-sm text-zinc-500">· {c.role}</span>}
                </div>
              </div>
              {c.summary && <p className="text-sm text-zinc-700 dark:text-zinc-300">{c.summary}</p>}
              {c.projects && c.projects.length > 0 && (
                <div className="flex flex-col gap-4">
                  {c.projects.map((p, pi) => (
                    <div key={pi} className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h4 className="text-sm font-medium">{p.title}</h4>
                        <span className="text-xs text-zinc-500">({p.period})</span>
                      </div>
                      <ul className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {p.details.map((d, di) => (
                          <li key={di} className="pl-3 relative before:content-['-'] before:absolute before:left-0 before:text-zinc-400">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {c.stack && c.stack.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.stack.map((s) => (
                    <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {(c.region || c.resignReason) && (
                <div className="text-xs text-zinc-500 flex gap-3">
                  {c.region && <span>근무지 {c.region}</span>}
                  {c.resignReason && <span>퇴사사유 {c.resignReason}</span>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* 학력 */}
      <Section title="학력">
        <ol className="flex flex-col gap-6">
          {sortedEducations.map((e, idx) => (
            <li key={idx} className="flex flex-col gap-2 border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-zinc-500">{e.period} · {e.status}</div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="font-medium">{e.school}</h3>
                  {e.department && <span className="text-sm text-zinc-500">{e.department}</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                {e.region && <span>지역 {e.region}</span>}
                {e.gpa && <span>학점 {e.gpa}</span>}
              </div>
              {e.projects && e.projects.length > 0 && (
                <ul className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300 mt-1">
                  {e.projects.map((p, pi) => (
                    <li key={pi} className="pl-3 relative before:content-['-'] before:absolute before:left-0 before:text-zinc-400">
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* 경험/활동/교육 */}
      <Section title="경험 · 활동 · 교육">
        <ol className="flex flex-col gap-6">
          {sortedTrainings.map((t, idx) => (
            <li key={idx} className="flex flex-col gap-2 border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
              <div className="text-xs text-zinc-500">{t.period}</div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="font-medium">{t.org}</h3>
                <span className="text-sm text-zinc-500">{t.course}</span>
              </div>
              {t.learned && t.learned.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {t.learned.map((s) => (
                    <span key={s} className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </Section>

      {/* 자격증 */}
      <Section title="자격증">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {certifications.map((c, idx) => (
            <li key={idx} className="flex flex-col gap-0.5 p-3 rounded border border-zinc-200 dark:border-zinc-800">
              <div className="font-medium text-sm">{c.name}</div>
              <div className="text-xs text-zinc-500">{c.issuer} · {c.acquiredAt}</div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 취업 우대사항 */}
      {military && (
        <Section title="취업 우대사항">
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            <span className="font-medium">병역 · {military.status}</span> — {military.type} ({military.period})
          </div>
        </Section>
      )}

      {/* 포트폴리오 */}
      <Section title="포트폴리오" sub={`총 ${portfolios.length}건`}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {portfolios.map((p, idx) => (
            <li key={idx}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col gap-1 p-3 rounded border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="font-medium text-sm group-hover:underline">{p.title}</div>
                <div className="text-xs text-zinc-500">
                  {p.period}
                  {p.teamSize && ` · 팀 ${p.teamSize}명`}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* 자기소개서 */}
      <Section title="자기소개서">
        <div className="prose prose-zinc dark:prose-invert max-w-none prose-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverLetter}</ReactMarkdown>
        </div>
      </Section>

      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← 홈으로
        </Link>
      </div>
    </div>
  );
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded border border-zinc-200 dark:border-zinc-800">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="font-medium text-sm">{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">{title}</h2>
        {sub && <span className="text-xs text-zinc-500">{sub}</span>}
      </div>
      {children}
    </section>
  );
}
