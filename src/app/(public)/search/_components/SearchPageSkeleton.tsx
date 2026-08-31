import { Skeleton } from "@/components/ui/skeleton"

export const SearchPageSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* 検索バー */}
      <Skeleton className="h-12 w-full rounded-lg" />

      <div className="space-y-4">
        {/* タブ */}
        <div className="flex gap-6 border-b pb-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* 医薬品カード一覧 */}
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
