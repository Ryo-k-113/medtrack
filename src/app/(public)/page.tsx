"use client"

import { Search } from "lucide-react"
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
        <section className="mx-auto max-w-2xl space-y-3 py-4 md:py-6">
          <h1 className="flex items-center justify-center gap-2 text-lg font-bold md:text-xl">
            <Search className="h-5 w-5 text-primary md:h-6 md:w-6" aria-hidden="true" />
            医薬品の出荷状況を検索
          </h1>
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
