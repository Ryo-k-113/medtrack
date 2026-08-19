import { Skeleton } from "@/components/ui/skeleton"

const FIELD_GROUP_COUNTS = [4, 4, 3, 2]

export default function AdminDrugEditLoading() {
  return (
    <div>
      {/* ページヘッダー */}
      <div className="flex justify-between items-center pb-4 border-b">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* 製品情報 */}
      <div className="py-10">
        <div className="border rounded-md bg-background shadow-sm">
          <div className="flex justify-between items-center border-b px-6 py-4">
            <Skeleton className="h-6 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
            {FIELD_GROUP_COUNTS.map((fieldCount, groupIndex) => (
              <div
                key={groupIndex}
                className="flex flex-col gap-4 bg-surface border p-4 rounded-md"
              >
                {[...Array(fieldCount)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 包装一覧 */}
      <div className="border p-6 rounded-md bg-background shadow-sm">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <Skeleton className="h-6 w-24" />
        </div>

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

        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
