import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 서버 왼쪽 아래 Next.js 표시(동그라미 버튼) 숨김 - 배포 화면엔 원래 안 나옴
  devIndicators: false,
};

export default nextConfig;
