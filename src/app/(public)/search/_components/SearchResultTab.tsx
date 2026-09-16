import type { ProductType } from "@prisma/client"
import { TabsContent } from "@/components/ui/tabs"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { DrugCard } from "./DrugCard"
import { useDrugSearch } from "@/hooks/useDrugSearch"
import { ShippingStatusGuide } from "./ShippingStatusGuide"
import { SearchResultTabSkeleton } from "./SearchResultTabSkeleton"
import { ProductTypeFilter } from "./ProductTypeFilter"

type Props = {
  keyword: string
  result:  ReturnType<typeof useDrugSearch>
  productTypes: ProductType[]
  onChangeProductTypes: (types: ProductType[]) => void
}

export const SearchResultTab = ({
  keyword,
  result,
  productTypes,
  onChangeProductTypes,
}: Props) => {
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

  return (
    <TabsContent value={keyword} className="space-y-4 pt-4">

      {/* 出荷状況のガイドと絞り込み
          絞り込んだ結果が0件でも条件を戻せるよう、この行は常に表示する */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* 出荷ステータスガイド */}
        <ShippingStatusGuide className="justify-start" />

        {/* 製品区分の絞り込みと1ページあたりの表示件数（ラベルはそれぞれの上に置く） */}
        <div className="flex flex-wrap items-end justify-end gap-x-3 gap-y-2 self-end md:self-auto">
          <ProductTypeFilter
            selected={productTypes}
            onChange={onChangeProductTypes}
          />
          <PaginationPageSize
            limit={pageSize}
            onLimitChange={changePageSize}
            direction="vertical"
          />
        </div>
      </div>

      {/* ローディング */}
      {isLoading && <SearchResultTabSkeleton />}

      {/* エラー表示 */}
      {!isLoading && error && (
        <p className="text-center text-destructive py-12">
          検索中にエラーが発生しました
        </p>
      )}

      {/* 該当がなかった場合 */}
      {!isLoading && !error && drugs.length === 0 && (
        <p className="text-center text-weak py-12">
          該当する医薬品が見つかりませんでした
        </p>
      )}

      {/* 検索結果 */}
      {!isLoading && !error && drugs.length > 0 && (
        <>
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
}
