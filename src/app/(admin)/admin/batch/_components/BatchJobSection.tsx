"use client"

import { BaseTable } from "@/components/Table/BaseTable"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { PaginationControl } from "@/components/Pagination/PaginationControl"
import { PaginationPageSize } from "@/components/Pagination/PaginationPageSize"
import { BatchLogColumns } from "./BatchLogColumns"
import { useAdminBatchLogs } from "../_hooks/useAdminBatchLogs"


// 定期実行の処理ごとの状況表示・手動実行と、全処理の実行履歴
export const BatchJobSection = () => {
  const {
    logs,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    changePage,
    changePageSize,
  } = useAdminBatchLogs()


  if (error) {
    return (
      <p className="py-12 text-center text-sm text-destructive">
        実行履歴の取得中にエラーが発生しました
      </p>
    )
  }

  if (isLoading) return <DataTableSkeleton />

  return (
    <div className="space-y-[56px] pt-8">

      {/* 実行履歴 */}
      <div className="space-y-3">
        <h2 className="font-bold pl-2">実行履歴</h2>

        <div className="space-y-2">
          {/* 実行履歴のテーブル表示 */}
          <BaseTable
            columns={BatchLogColumns}
            data={logs}
            emptyContent="実行履歴はまだありません。"
          />

          {/* 表示件数とページネーション */}
          <div className="flex justify-end">
            <PaginationPageSize limit={pageSize} onLimitChange={changePageSize} />

            <PaginationControl
              page={page}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
