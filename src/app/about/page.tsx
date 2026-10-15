import type { Metadata } from "next";
import AboutView from "@/components/AboutView";
import { ABOUT } from "@/lib/about";

export const metadata: Metadata = { title: "소개" };

// 경력 기간이 오늘 날짜로 계산되므로 하루에 한 번 다시 그림
export const revalidate = 86400;

export default function AboutPage() {
  return <AboutView about={ABOUT} />;
}
