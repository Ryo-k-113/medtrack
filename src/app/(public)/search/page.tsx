"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { SearchBar } from "@/app/(public)/_components/SearchBar"
import { DrugCard } from "./_components/DrugCard"
import { useDrugSearch } from "@/hooks/useDrugSearch"
import { useSupabaseSession } from "@/hooks/useSupabaseSession"
import { ShippingStatusGuide } from "./_components/ShippingStatusGuide"


// 未ログイン時は1件、ログイン時は3件まで同時検索
const MAX_KEYWORDS_GUEST = 1
const MAX_KEYWORDS_MEMBER = 3

export default function SearchResultPage() {
  const searchParams = useSearchParams()
  const { session } = useSupabaseSession()

  const maxKeywords = session ? MAX_KEYWORDS_MEMBER : MAX_KEYWORDS_GUEST

  const keywords = (searchParams.get("query") ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0)
    .slice(0, maxKeywords)

  // タブの数に関わらず、常に固定回数フックを呼び出す（未使用分は空文字を渡し結果を破棄する）
  const result0 = useDrugSearch(keywords[0] ?? "")
  const result1 = useDrugSearch(keywords[1] ?? "")
  const result2 = useDrugSearch(keywords[2] ?? "")
  const results = [result0, result1, result2].slice(0, keywords.length)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* 検索バー */}
      <SearchBar defaultKeyword={keywords.join(",")} />
      
      {keywords.length === 0 ? (
        <div className="md:py-16 text-center text-weak">
          検索キーワードを入力してください
        </div>
      ) : (
      <Tabs key={keywords.join(",")} defaultValue={keywords[0]} className="w-full">

        {/* 出荷ステータスガイド */}
        <ShippingStatusGuide className="justify-end" />

        {/* キーワードごとのタブ */}
        <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          {keywords.map((keyword, index) => (
            <TabsTrigger
              key={keyword}
              value={keyword}
              className="text-weak/60 rounded-none border-b-2 border-transparent px-1 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {keyword}
              <span className="ml-1.5 text-xs text-weak">
                ({results[index].isLoading ? "…" : results[index].totalCount}件)
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* タブごとの検索結果 */}
        {keywords.map((keyword, index) => {
          const {
            drugs,
            isLoading,
            error,
            page,
            pageSize,
            totalPages,
            changePage,
            changePageSize,
          } = results[index]

          return (
            <TabsContent key={keyword} value={keyword} className="space-y-4 pt-4">
              {isLoading ? (
                <p className="text-center text-weak py-12">読み込み中...</p>
              ) : error ? (
                <p className="text-center text-destructive py-12">検索中にエラーが発生しました</p>
              ) : drugs.length === 0 ? (
                <p className="text-center text-weak py-12">該当する医薬品が見つかりませんでした</p>
              ) : (
                <>
                  {/* 1ページあたりの表示件数 */}
                  <div className="flex justify-end">
                    <PaginationPageSize
                      limit={pageSize}
                      onLimitChange={changePageSize}
                    />
                  </div>

                  {/* 医薬品カード一覧 */}
                  <div className="grid grid-cols-1 gap-4">
                    {drugs.map((drug) => (
                      <DrugCard key={drug.id} drug={drug} />
                    ))}
                  </div>

                  {/* ページネーション */}
                  <div className="flex justify-end">
                    <PaginationControl
                      page={page}
                      totalPages={totalPages}
                      onPageChange={changePage}
                    />
                  </div>
                </>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
      )}
    </div>
  )
}
