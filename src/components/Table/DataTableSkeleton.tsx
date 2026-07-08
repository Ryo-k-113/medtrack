import { Skeleton } from "@/components/ui/skeleton"


/** ローディング中に表示するDataTableのスケルトンコンポーネント */
export const DataTableSkeleton = ({
  rowCount = 8,
}) => {
  return (
    <div>
      {/* 検索ボックスエリア */}
      <div className="py-10 flex justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* テーブル */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full table-fixed">

          {/* ヘッダー */}
          <thead className="border-b">
            <tr>
              <th className="h-12 bg-surface w-16" />
              <th className="h-12 bg-surface" />
              <th className="h-12 bg-surface w-24" />
            </tr>
          </thead>
          

          {/* ボディ */}
          <tbody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                <td className="p-4">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-4 w-full" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-8 w-16 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーションエリア */}
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  )
}