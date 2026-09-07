"use client"

import { Suspense } from "react"
import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"
import { BatchJobSection } from "./_components/BatchJobSection"

export default function AdminBatchPage() {
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle title="定期実行管理" />

      {/* 処理ごとの状況・手動実行と、全処理の実行履歴 */}
      <Suspense fallback={<DataTableSkeleton />}>
        <BatchJobSection />
      </Suspense>
    </div>
  )
}
