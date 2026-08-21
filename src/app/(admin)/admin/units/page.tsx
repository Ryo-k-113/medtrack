"use client"

import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { UnitList } from "./_components/UnitList"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/components/Table/DataTableSkeleton"


export default function AdminUnitsPage() {
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle
        title="規格単位一覧"
      />

      {/* 規格単位一覧 */}
      <Suspense fallback={<DataTableSkeleton />}>
        <UnitList />
      </Suspense>
    </div>
  )
}