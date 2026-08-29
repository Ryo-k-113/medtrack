import { TabsContent } from "@/components/ui/tabs"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { DrugCard } from "./DrugCard"
import { useDrugSearch } from "@/hooks/useDrugSearch"
import { ShippingStatusGuide } from "./ShippingStatusGuide"

type Props = {
  keyword: string
  result:  ReturnType<typeof useDrugSearch>
}

export const SearchResultTab = ({ keyword, result }: Props) => {
  const {
    drugs,
    isLoading,
    error,
    page,
    pageSize,
    totalPages,
    changePage,
    changePageSize,
  } = result

  // ローディング
  if (isLoading) return (
    <TabsContent value={keyword}>
      <p className="text-center text-weak py-12">
        読み込み中...
      </p>
    </TabsContent>
  )

  // エラー表示
  if (error) return (
    <TabsContent value={keyword}>
      <p className="text-center text-destructive py-12">
        検索中にエラーが発生しました
      </p>
    </TabsContent>
  )

  // 該当がなかった場合
  if (drugs.length === 0) return (
    <TabsContent value={keyword}>
      <p className="text-center text-weak py-12">
        該当する医薬品が見つかりませんでした
      </p>
    </TabsContent>
  )

  // 成功 
  return (
    <TabsContent value={keyword} className="space-y-4 pt-4">

      <div className="flex justify-between items-center">
        {/* 出荷ステータスガイド */}
        <ShippingStatusGuide className="justify-start" />
        {/* 1ページあたりの表示件数 */}
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

    </TabsContent>
  )
}