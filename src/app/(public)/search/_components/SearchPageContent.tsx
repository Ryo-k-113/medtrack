"use client"

import { useSearchParams } from "next/navigation"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { SearchBar } from "@/app/(public)/_components/SearchBar"
import { SearchResults } from "./SearchResults"


// 未ログイン時は1件、ログイン時は3件まで同時検索
const MAX_KEYWORDS_GUEST = 1
const MAX_KEYWORDS_MEMBER = 3

export const SearchPageContent = () => {
  const searchParams = useSearchParams()
  const { session } = useSupabaseSession()

  const maxKeywords = session ? MAX_KEYWORDS_MEMBER : MAX_KEYWORDS_GUEST

  const keywords = (searchParams.get("query") ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0)
    .slice(0, maxKeywords)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* 検索バー */}
      <SearchBar defaultKeyword={keywords.join(",")} />

      {/* 検索結果のタブ表示 */}
      <SearchResults keywords={keywords} />
    </div>
  )
}
