"use client"

import { Suspense } from "react";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { NoticeMessage } from "@/components/Notice/NoticeMessage";
import { ClarityAnalytics } from "@/components/Analytics/ClarityAnalytics";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      {/* useSearchParamsを含むため、ページの描画とは境界を分ける */}
      <Suspense>
        <NoticeMessage />
      </Suspense>

      {/* Clarityの計測（公開ページのみ） */}
      <ClarityAnalytics />

      <Header />
      <main className="flex flex-1 flex-col bg-gray-50 pb-10 md:pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
