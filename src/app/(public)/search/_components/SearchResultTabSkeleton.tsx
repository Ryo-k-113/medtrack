import { Skeleton } from "@/components/ui/skeleton"

export const SearchResultTabSkeleton = () => {
  return (
    <div className="space-y-4 pt-4">
      {/* 出荷ステータスガイド・表示件数 */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-24" />
      </div>

      {/* 医薬品カード一覧 */}
      <div className="grid grid-cols-1 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
