"use client"

import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { GenericNameList } from "./_components/GenericNameList"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"


export default function AdminGenericNamesPage() {
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle
        title="成分名一覧"
      />

      {/* 成分名一覧 */}
      <Suspense fallback={<DataTableSkeleton />}>
        <GenericNameList />
      </Suspense>
    </div>
  )
}