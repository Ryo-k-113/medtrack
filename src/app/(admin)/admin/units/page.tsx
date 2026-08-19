"use client"

import { AdminPageTitle } from "@/app/(admin)/admin/_components/AdminPageTitle"
import { UnitList } from "./_components/UnitList"


export default function AdminUnitsPage() {
  return (
    <div>
      {/* ページタイトル */}
      <AdminPageTitle
        title="規格単位一覧"
      />

      {/* 規格単位一覧 */}
      <UnitList />
    </div>
  )
}