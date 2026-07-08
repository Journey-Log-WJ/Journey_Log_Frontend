import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "저니로그",
  description: "원준의 살아있는 이력서 — 과거·현재·미래의 기록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-40 border-b border-[#8B5A2B]/15 bg-[#f5ede0]/85 dark:bg-[#2a2016]/85 backdrop-blur-md">
          <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
            <Link href="/" className="font-semibold tracking-tight text-[#8B5A2B] dark:text-[#D4A574]">
              저니로그
            </Link>
            <div className="flex items-center gap-6 text-sm text-stone-600 dark:text-stone-400">
              <Link href="/about" className="hover:text-[#8B5A2B] dark:hover:text-[#D4A574]">
                about
              </Link>
              <Link href="/log" className="hover:text-[#8B5A2B] dark:hover:text-[#D4A574]">
                log
              </Link>
              <Link href="/roadmap" className="hover:text-[#8B5A2B] dark:hover:text-[#D4A574]">
                roadmap
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
