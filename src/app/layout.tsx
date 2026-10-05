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

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/log", label: "Log" },
  { href: "/roadmap", label: "Roadmap" },
];

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
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-40 border-b border-line bg-background/70 backdrop-blur-xl">
          <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 h-14">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="size-2 rounded-full bg-accent" />
              JourneyLog
            </Link>
            <div className="flex items-center gap-1 text-sm text-muted">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
