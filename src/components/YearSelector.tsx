"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  paramName?: string;
  years: number[];
  defaultLabel?: string;
};

export default function YearSelector({
  paramName = "year",
  years,
  defaultLabel = "지난 1년",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) ?? "";

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set(paramName, e.target.value);
    } else {
      params.delete(paramName);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <select
      value={current}
      onChange={onChange}
      className="text-xs bg-transparent border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-zinc-700 dark:text-zinc-300"
    >
      <option value="">{defaultLabel}</option>
      {years.map((y) => (
        <option key={y} value={y}>
          {y}년
        </option>
      ))}
    </select>
  );
}
