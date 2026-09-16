
import { useState } from "react"
import type { ProductType } from "@prisma/client"
import { BaseTabs } from "@/components/Tabs/BaseTabs"
import { useDrugSearch } from "@/hooks/useDrugSearch"
import { SearchResultTab } from "./SearchResultTab"


type Props = {
  keywords: string[]
}

export const SearchResults = ({ keywords }: Props) => {
  // 製品区分の絞り込み（すべてのキーワードのタブに共通で適用する）
  const [productTypes, setProductTypes] = useState<ProductType[]>([])

  const result0 = useDrugSearch(keywords[0] ?? "", productTypes)
  const result1 = useDrugSearch(keywords[1] ?? "", productTypes)
  const result2 = useDrugSearch(keywords[2] ?? "", productTypes)
  const results = [result0, result1, result2].slice(0, keywords.length)

  if (keywords.length === 0) {
    return (
      <div className="md:py-16 text-center text-weak">
        検索キーワードを入力してください
      </div>
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
        label: keyword,
        count: results[index].isLoading ? "…" : results[index].totalCount,
      }))}
    >
      {/* タブコンテンツ  */}
      {keywords.map((keyword, index) => (
        <SearchResultTab
          key={keyword}
          keyword={keyword}
          result={results[index]}
          productTypes={productTypes}
          onChangeProductTypes={setProductTypes}
        />
      ))}
    </BaseTabs>
  )
}
