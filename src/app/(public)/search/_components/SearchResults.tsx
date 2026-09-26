
import { useState } from "react"
import { Lock } from "lucide-react"
import type { ProductType } from "@prisma/client"
import { BaseTabs } from "@/components/Tabs/BaseTabs"
import { useDrugSearch } from "@/hooks/useDrugSearch"
import { SearchResultTab } from "./SearchResultTab"
import { LockedResultTab } from "./LockedResultTab"


type Props = {
  keywords: string[]
  unlockedCount: number  // 検索可能なキーワード数
}

export const SearchResults = ({ keywords, unlockedCount }: Props) => {
  // 製品区分の絞り込み（すべてのキーワードのタブに共通で適用する）
  const [productTypes, setProductTypes] = useState<ProductType[]>([])

  // 鍵付きのキーワードも検索し、件数とぼかした結果を見せて登録案内
  const isLocked = (index: number) => index >= unlockedCount

  const result0 = useDrugSearch(keywords[0] ?? "", productTypes)
  const result1 = useDrugSearch(keywords[1] ?? "", productTypes)
  const result2 = useDrugSearch(keywords[2] ?? "", productTypes)
  const results = [result0, result1, result2].slice(0, keywords.length)

  if (keywords.length === 0) {
    return (
      <div className="py-10 md:py-16 text-center text-weak">
        検索キーワードを入力してください
      </div>
    )
  }

  // タブの見出し（鍵付きは鍵のアイコンを付ける）
  const renderLabel = (keyword: string, index: number) => {
    if (!isLocked(index)) {
      return keyword
    }
    return (
      <span className="flex items-center gap-1">
        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
        {keyword}
        {/* 鍵のアイコンの意味を読み上げでも伝える */}
        <span className="sr-only">（無料登録で表示）</span>
      </span>
    )
  }

  // タブの件数（鍵付きでも件数は表示。読み込み中は「…」）
  const getCount = (index: number) => {
    const result = results[index]
    if (result.isLoading) {
      return "…"
    }
    return result.totalCount
  }

  // タブの中身（鍵付きはぼかした結果と登録案内）
  const renderContent = (keyword: string, index: number) => {
    if (isLocked(index)) {
      return <LockedResultTab key={keyword} keyword={keyword} result={results[index]} />
    }
    return (
      <SearchResultTab
        key={keyword}
        keyword={keyword}
        result={results[index]}
        productTypes={productTypes}
        onChangeProductTypes={setProductTypes}
      />
    )
  }

  return (
    // 検索結果のタブ表示
    <BaseTabs
      key={keywords.join(",")}
      defaultValue={keywords[0]}
      className="w-full"
      items={keywords.map((keyword, index) => ({
        value: keyword,
        label: renderLabel(keyword, index),
        count: getCount(index),
      }))}
    >
      {/* タブコンテンツ  */}
      {keywords.map((keyword, index) => renderContent(keyword, index))}
    </BaseTabs>
  )
}
