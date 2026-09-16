import { Skeleton } from "@/components/ui/skeleton"

/** 検索結果の読み込み表示（出荷状況のガイドと絞り込みの行は、タブ側で常に表示する） */
export const SearchResultTabSkeleton = () => {
  return (
    // 医薬品カード一覧
    <div className="grid grid-cols-1 gap-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  )
}
