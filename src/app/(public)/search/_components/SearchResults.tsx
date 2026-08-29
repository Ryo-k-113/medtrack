
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDrugSearch } from "@/hooks/useDrugSearch"
import { SearchResultTab } from "./SearchResultTab"
import { ShippingStatusGuide } from "./ShippingStatusGuide"


type Props = {
  keywords: string[]
}

export const SearchResults = ({ keywords }: Props) => {
  const result0 = useDrugSearch(keywords[0] ?? "")
  const result1 = useDrugSearch(keywords[1] ?? "")
  const result2 = useDrugSearch(keywords[2] ?? "")
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
    <Tabs
      key={keywords.join(",")}
      defaultValue={keywords[0]}
      className="w-full"
    > 
    
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

      {/* タブコンテンツ  */}
      {keywords.map((keyword, index) => (
        <SearchResultTab
          key={keyword}
          keyword={keyword}
          result={results[index]}
        />
      ))}
    </Tabs>
  )
}