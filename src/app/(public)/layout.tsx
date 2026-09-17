"use client"

import { Suspense } from "react";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { NoticeMessage } from "@/components/Notice/NoticeMessage";
import { ClarityAnalytics } from "@/components/Analytics/ClarityAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

/** GA4の測定ID */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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

      <ClarityAnalytics />
      {/* GA4の計測（公開ページのみ） */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      {/* ページの表示速度の計測 */}
      <SpeedInsights />

      <Header />
      <main className="flex flex-1 flex-col bg-gray-50 pb-10 md:pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
