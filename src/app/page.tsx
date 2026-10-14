import HomeView from "@/components/HomeView";
import { ABOUT } from "@/lib/about";

type PageProps = {
  searchParams: Promise<{ year?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { year } = await searchParams;
  return <HomeView year={year} about={ABOUT} />;
}
