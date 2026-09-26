"use client"

import { useSearchParams } from "next/navigation"
import { useMe } from "@/hooks/useMe"
import { PageContainer } from "@/components/Layout/PageContainer"
import { SearchBar } from "@/app/(public)/_components/SearchBar"
import { splitMultiKeywords } from "@/utils/search"
import { SearchResults } from "./SearchResults"


// 同時に検索できる件数（未ログインは1件、ログイン時は3件）
// 未ログインでも3件まで受け取り、2件目以降は鍵付きのタブで無料登録を案内する
const MAX_KEYWORDS_GUEST = 1
const MAX_KEYWORDS = 3

export const SearchPageContent = () => {
  const searchParams = useSearchParams()
  const { isLoggedIn, isLoading } = useMe()

  // URLを直接入力された場合も「、」などで区切れるよう、検索バーと同じ分け方にする
  const keywords = splitMultiKeywords(searchParams.get("query")).slice(0, MAX_KEYWORDS)

  // 結果を表示できる件数（ログイン状態の確認中は、会員に鍵が一瞬見えないよう制限しない）
  const unlockedCount = isLoggedIn || isLoading ? MAX_KEYWORDS : MAX_KEYWORDS_GUEST

  return (
    <PageContainer className="max-w-5xl space-y-8">
      <div>
        {/* 画面には出さず、読み上げと検索エンジンにページの主題を伝える */}
        <h1 className="sr-only">医薬品の検索結果</h1>

        {/* 検索バー */}
        <SearchBar defaultKeyword={keywords.join(",")} className="md:py-8" />
      </div>

      {/* 検索結果のタブ表示 */}
      <SearchResults keywords={keywords} unlockedCount={unlockedCount} />
    </PageContainer>
  )
}
