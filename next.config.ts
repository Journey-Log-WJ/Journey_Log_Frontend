import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 서버 왼쪽 아래 Next.js 표시(동그라미 버튼) 숨김 - 배포 화면엔 원래 안 나옴
  devIndicators: false,
  // 이름이 바뀐 페이지의 예전 주소는 새 주소로 (about → resume, 로드맵 → 연혁)
  async redirects() {
    return [
      { source: "/about", destination: "/resume", permanent: true },
      { source: "/roadmap", destination: "/history", permanent: true },
      { source: "/roadmap/:slug", destination: "/history", permanent: true },
    ];
  },
};

export default nextConfig;
