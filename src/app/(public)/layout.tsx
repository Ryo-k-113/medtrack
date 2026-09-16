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
      {/* 背景は公開ページ共通（カードや入力欄は白で浮かせる）
          コンテンツの量に関係なくフッターとの間を空けるため、下に余白を取る */}
      <main className="flex flex-1 flex-col bg-gray-50 pb-10 md:pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
