"use client"

import { Suspense } from "react";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { NoticeMessage } from "@/components/Notice/NoticeMessage";

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

      <Header />
      {/* 背景は公開ページ共通（カードや入力欄は白で浮かせる） */}
      <main className="flex flex-1 flex-col bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
}
