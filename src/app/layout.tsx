import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
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
  title: "전라남도 도서지역 특화 DRT",
  description: "버스 모니터링 및 운행관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <header className="w-full bg-[#363636] text-white">
          <div className="mx-auto max-w-[1920px] px-6 h-[64px] flex items-center gap-8">
            <h1 className="text-lg font-semibold whitespace-nowrap">
              전라남도 도서지역 특화 DRT
            </h1>
            <nav className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/vehicle" className="hover:underline">
                차량관리
              </Link>
              <Link href="/route" className="hover:underline">
                노선관리
              </Link>
              <Link href="/stop" className="hover:underline">
                정류장관리
              </Link>
              <Link href="/dispatch" className="hover:underline">
                배차관리
              </Link>
              <Link href="/monitoring" className="hover:underline">
                모니터링
              </Link>
              <Link href="/calls" className="hover:underline">
                호출기록
              </Link>
              <Link href="/selectOperLogList" className="hover:underline">
                운행로그
              </Link>
              <Link href="/stats" className="hover:underline">
                호출통계
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-[1920px] min-h-[calc(100vh-64px-72px)] px-6 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
