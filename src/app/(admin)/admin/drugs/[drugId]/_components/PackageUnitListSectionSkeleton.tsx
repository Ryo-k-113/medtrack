import { Skeleton } from "@/components/ui/skeleton"

export const PackageUnitListSectionSkeleton = () => {
  return (
    <div className="border p-6 rounded-md bg-background shadow-sm">
      {/* ヘッダー */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <Skeleton className="h-6 w-24" />
      </div>

      {/* 包装カード */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border rounded-md mb-3 p-4"
        >
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}

      {/* 包装追加ボタン */}
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
