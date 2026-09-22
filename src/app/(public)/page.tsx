"use client"

import { PageContainer } from "@/components/Layout/PageContainer"
import { SearchBar } from "./_components/SearchBar"
import { TopBanner } from "./_components/TopBanner"
import { FeatureGuide } from "./_components/FeatureGuide"
import { PackageAnnouncementSection } from "./_components/PackageAnnouncementSection"


export default function TopPage() {
  return (
    <div>

      {/* お知らせバナー */}
      <TopBanner />

      {/* 2. メインコンテンツエリア (2カラムレイアウト) */}
      <PageContainer className="max-w-7xl space-y-8">
        
        {/* 上部：検索バーエリア */}
        <section className="max-w-2xl mx-auto space-y-3">
          <h1 className="text-center text-lg font-bold md:text-xl">医薬品の出荷状況を検索</h1>
          <SearchBar />
        </section>

        {/* できることの案内（畳める） */}
        <FeatureGuide />

        {/* 下部：医薬品の更新情報（左：カード一覧 / 右：カレンダー） */}
        <PackageAnnouncementSection />
      </PageContainer>
    </div>
  )
}
